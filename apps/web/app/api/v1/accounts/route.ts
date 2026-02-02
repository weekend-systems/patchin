import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { db, connectedAccount } from "@/lib/db";
import { eq } from "drizzle-orm";

// GET - List user's connected accounts (API key auth)
export async function GET(request: NextRequest) {
  const authResult = await validateApiKey(request);
  if (!authResult.valid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
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
    .where(eq(connectedAccount.userId, authResult.userId!));

  return NextResponse.json({ accounts });
}
