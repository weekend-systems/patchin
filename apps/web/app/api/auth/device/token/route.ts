import { NextRequest, NextResponse } from "next/server";
import { db, deviceAuthorization } from "@/lib/db";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";
import { decryptToken } from "@/lib/crypto";

// POST - Poll for device authorization completion
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { device_code } = body;

  if (!device_code || typeof device_code !== "string") {
    return NextResponse.json({ error: "Device code required" }, { status: 400 });
  }

  const hash = createHash("sha256").update(device_code).digest("hex");

  const records = await db
    .select()
    .from(deviceAuthorization)
    .where(eq(deviceAuthorization.deviceCodeHash, hash))
    .limit(1);

  if (records.length === 0) {
    return NextResponse.json({ error: "Invalid device code" }, { status: 404 });
  }

  const record = records[0];

  // Check if expired
  if (record.expiresAt < new Date() || record.status === "expired") {
    return NextResponse.json({
      status: "expired",
      error: "Device code has expired",
    });
  }

  // Check if completed
  if (record.status === "completed") {
    if (record.apiKeyEncrypted) {
      // Decrypt and return the API key
      const apiKey = decryptToken(record.apiKeyEncrypted);

      // Clear the encrypted key (only returned once)
      await db
        .update(deviceAuthorization)
        .set({ apiKeyEncrypted: null })
        .where(eq(deviceAuthorization.id, record.id));

      return NextResponse.json({
        status: "completed",
        api_key: apiKey,
      });
    } else {
      // Key was already retrieved
      return NextResponse.json({
        status: "completed",
        error: "API key already retrieved",
      });
    }
  }

  // Still pending
  return NextResponse.json({
    status: "pending",
  });
}
