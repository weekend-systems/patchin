import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db, apiKey } from "@/lib/db";
import { eq } from "drizzle-orm";
import { generateApiKey } from "@/lib/crypto";
import { randomBytes } from "crypto";

// GET - List user's API keys
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = await db
    .select({
      id: apiKey.id,
      name: apiKey.name,
      keyPrefix: apiKey.keyPrefix,
      lastUsedAt: apiKey.lastUsedAt,
      expiresAt: apiKey.expiresAt,
      createdAt: apiKey.createdAt,
    })
    .from(apiKey)
    .where(eq(apiKey.userId, session.user.id));

  return NextResponse.json({ keys });
}

// POST - Create new API key
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { key, prefix, hash } = generateApiKey();

  await db.insert(apiKey).values({
    id: randomBytes(16).toString("hex"),
    userId: session.user.id,
    name,
    keyHash: hash,
    keyPrefix: prefix,
  });

  // Return the key only once - user must save it
  return NextResponse.json({
    key,
    prefix,
    name,
    message: "Save this key - it won't be shown again",
  });
}

// DELETE - Delete an API key
export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const keyId = searchParams.get("id");

  if (!keyId) {
    return NextResponse.json({ error: "Key ID required" }, { status: 400 });
  }

  // Verify ownership before deletion
  const existing = await db
    .select()
    .from(apiKey)
    .where(eq(apiKey.id, keyId))
    .limit(1);

  if (existing.length === 0 || existing[0].userId !== session.user.id) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  await db.delete(apiKey).where(eq(apiKey.id, keyId));

  return NextResponse.json({ success: true });
}
