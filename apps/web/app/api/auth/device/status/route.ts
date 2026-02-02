import { NextRequest, NextResponse } from "next/server";
import { db, deviceAuthorization } from "@/lib/db";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";

// GET - Check if device code is valid
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Device code required" }, { status: 400 });
  }

  const hash = createHash("sha256").update(code).digest("hex");

  const records = await db
    .select()
    .from(deviceAuthorization)
    .where(eq(deviceAuthorization.deviceCodeHash, hash))
    .limit(1);

  if (records.length === 0) {
    return NextResponse.json({
      valid: false,
      expired: false,
      claimed: false,
    });
  }

  const record = records[0];
  const now = new Date();
  const expired = record.expiresAt < now || record.status === "expired";
  const claimed = record.userId !== null;

  return NextResponse.json({
    valid: true,
    expired,
    claimed,
  });
}
