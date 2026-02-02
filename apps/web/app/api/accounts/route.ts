import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db, connectedAccount } from "@/lib/db";
import { eq, and } from "drizzle-orm";

// GET - List user's connected accounts
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await db
    .select({
      id: connectedAccount.id,
      provider: connectedAccount.provider,
      providerEmail: connectedAccount.providerEmail,
      isDefault: connectedAccount.isDefault,
      createdAt: connectedAccount.createdAt,
    })
    .from(connectedAccount)
    .where(eq(connectedAccount.userId, session.user.id));

  return NextResponse.json({ accounts });
}

// DELETE - Disconnect an account
export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("id");

  if (!accountId) {
    return NextResponse.json({ error: "Account ID required" }, { status: 400 });
  }

  // Verify ownership before deletion
  const existing = await db
    .select()
    .from(connectedAccount)
    .where(eq(connectedAccount.id, accountId))
    .limit(1);

  if (existing.length === 0 || existing[0].userId !== session.user.id) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const wasDefault = existing[0].isDefault;
  const provider = existing[0].provider;

  await db.delete(connectedAccount).where(eq(connectedAccount.id, accountId));

  // If deleted account was default, make another account for same provider the default
  if (wasDefault) {
    const remaining = await db
      .select()
      .from(connectedAccount)
      .where(
        and(
          eq(connectedAccount.userId, session.user.id),
          eq(connectedAccount.provider, provider)
        )
      )
      .limit(1);

    if (remaining.length > 0) {
      await db
        .update(connectedAccount)
        .set({ isDefault: true })
        .where(eq(connectedAccount.id, remaining[0].id));
    }
  }

  return NextResponse.json({ success: true });
}

// PATCH - Set account as default
export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, isDefault } = body;

  if (!id) {
    return NextResponse.json({ error: "Account ID required" }, { status: 400 });
  }

  // Verify ownership
  const account = await db
    .select()
    .from(connectedAccount)
    .where(eq(connectedAccount.id, id))
    .limit(1);

  if (account.length === 0 || account[0].userId !== session.user.id) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  if (isDefault) {
    // Clear other defaults for same provider
    await db
      .update(connectedAccount)
      .set({ isDefault: false })
      .where(
        and(
          eq(connectedAccount.userId, session.user.id),
          eq(connectedAccount.provider, account[0].provider)
        )
      );

    // Set this one as default
    await db
      .update(connectedAccount)
      .set({ isDefault: true })
      .where(eq(connectedAccount.id, id));
  }

  return NextResponse.json({ success: true });
}
