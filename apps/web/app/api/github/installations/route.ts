import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db, githubInstallation } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const installations = await db
      .select()
      .from(githubInstallation)
      .where(eq(githubInstallation.userId, session.user.id));

    return NextResponse.json({ installations });
  } catch (err) {
    console.error("Failed to fetch installations:", err);
    return NextResponse.json(
      { error: "Failed to fetch installations" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    // Verify the installation belongs to this user before deleting
    const installation = await db
      .select()
      .from(githubInstallation)
      .where(
        and(
          eq(githubInstallation.id, id),
          eq(githubInstallation.userId, session.user.id)
        )
      )
      .limit(1);

    if (installation.length === 0) {
      return NextResponse.json(
        { error: "Installation not found" },
        { status: 404 }
      );
    }

    await db
      .delete(githubInstallation)
      .where(eq(githubInstallation.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete installation:", err);
    return NextResponse.json(
      { error: "Failed to delete installation" },
      { status: 500 }
    );
  }
}
