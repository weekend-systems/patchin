import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db, deviceAuthorization } from "@/lib/db";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";

// POST - Claim a device authorization for the current user
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    return NextResponse.json({ error: "Device code has expired" }, { status: 410 });
  }

  // Check if pending
  if (record.status !== "pending") {
    return NextResponse.json({ error: "Device code already used" }, { status: 409 });
  }

  // Check if already claimed by a different user
  if (record.userId && record.userId !== session.user.id) {
    return NextResponse.json({ error: "Device code claimed by another user" }, { status: 403 });
  }

  // Claim for this user
  await db
    .update(deviceAuthorization)
    .set({ userId: session.user.id })
    .where(eq(deviceAuthorization.id, record.id));

  return NextResponse.json({ success: true });
}
