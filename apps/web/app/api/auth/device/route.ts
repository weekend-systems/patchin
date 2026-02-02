import { NextRequest, NextResponse } from "next/server";
import { db, deviceAuthorization } from "@/lib/db";
import { generateDeviceCode } from "@/lib/crypto";
import { randomBytes } from "crypto";

const DEVICE_CODE_EXPIRATION_MINUTES = 15;

// POST - Initiate device authorization flow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const { code, prefix, hash } = generateDeviceCode();

    const expiresAt = new Date(Date.now() + DEVICE_CODE_EXPIRATION_MINUTES * 60 * 1000);

    await db.insert(deviceAuthorization).values({
      id: randomBytes(16).toString("hex"),
      deviceCodeHash: hash,
      deviceCodePrefix: prefix,
      status: "pending",
      expiresAt,
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://patchin.sh";

    return NextResponse.json({
      device_code: code,
      verification_url: `${baseUrl}/setup/${code}`,
      expires_in: DEVICE_CODE_EXPIRATION_MINUTES * 60,
      interval: 5,
    });
  } catch (error) {
    console.error("Device auth initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate device authorization" },
      { status: 500 }
    );
  }
}
