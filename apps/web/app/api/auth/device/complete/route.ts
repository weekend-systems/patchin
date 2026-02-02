import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db, deviceAuthorization, apiKey, connectedAccount } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { createHash, randomBytes } from "crypto";
import { generateApiKey, encryptToken } from "@/lib/crypto";

// POST - Complete device authorization and generate API key
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { device_code, key_name } = body;

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
    return NextResponse.json({ error: "Device code has expired" }, { status: 410 });
  }

  // Check if already completed
  if (record.status === "completed") {
    return NextResponse.json({ error: "Device code already used" }, { status: 409 });
  }

  // Verify this device is claimed by the current user
  if (record.userId !== session.user.id) {
    return NextResponse.json({ error: "Device code not claimed by this user" }, { status: 403 });
  }

  // Check that user has at least one connected account
  const accounts = await db
    .select()
    .from(connectedAccount)
    .where(eq(connectedAccount.userId, session.user.id))
    .limit(1);

  if (accounts.length === 0) {
    return NextResponse.json({ error: "At least one account must be connected" }, { status: 400 });
  }

  // Generate new API key
  const { key, prefix, hash: keyHash } = generateApiKey();
  const keyId = randomBytes(16).toString("hex");
  const keyNameValue = typeof key_name === "string" && key_name.trim() ? key_name.trim() : "Agent";

  await db.insert(apiKey).values({
    id: keyId,
    userId: session.user.id,
    name: keyNameValue,
    keyHash,
    keyPrefix: prefix,
  });

  // Encrypt the API key for agent retrieval
  const encryptedKey = encryptToken(key);

  // Update device authorization as completed
  await db
    .update(deviceAuthorization)
    .set({
      status: "completed",
      apiKeyId: keyId,
      apiKeyEncrypted: encryptedKey,
    })
    .where(eq(deviceAuthorization.id, record.id));

  return NextResponse.json({
    success: true,
    message: "Setup complete. You can return to your terminal.",
  });
}
