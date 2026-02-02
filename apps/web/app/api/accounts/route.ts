import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db, connectedAccount } from "@/lib/db";
import { eq } from "drizzle-orm";

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

  await db.delete(connectedAccount).where(eq(connectedAccount.id, accountId));

  return NextResponse.json({ success: true });
}
