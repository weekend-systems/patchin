import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db, githubInstallation, connectedAccount } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { randomBytes } from "crypto";
import { decryptToken } from "@/lib/crypto";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const installationId = searchParams.get("installation_id");
  const setupAction = searchParams.get("setup_action");

  const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

  // Verify user is authenticated
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.redirect(`${baseUrl}/login?redirect=/github/install`);
  }

  // Handle uninstall/deletion
  if (setupAction === "delete" || !installationId) {
    return NextResponse.redirect(`${baseUrl}/github/install`);
  }

  try {
    // Get the user's GitHub access token from connected accounts
    const githubAccount = await db
      .select()
      .from(connectedAccount)
      .where(
        and(
          eq(connectedAccount.userId, session.user.id),
          eq(connectedAccount.provider, "github")
        )
      )
      .limit(1);

    if (githubAccount.length === 0) {
      return NextResponse.redirect(
        `${baseUrl}/github/install?error=no_github_account`
      );
    }

    const accessToken = decryptToken(githubAccount[0].accessTokenEncrypted);

    // Fetch installation details from GitHub API
    const installationRes = await fetch(
      `https://api.github.com/user/installations`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!installationRes.ok) {
      console.error("Failed to fetch installations:", await installationRes.text());
      return NextResponse.redirect(
        `${baseUrl}/github/install?error=fetch_failed`
      );
    }

    const installationsData = await installationRes.json();
    const installation = installationsData.installations?.find(
      (inst: { id: number }) => inst.id === parseInt(installationId, 10)
    );

    if (!installation) {
      // Installation might not be visible yet, or belongs to different user
      return NextResponse.redirect(
        `${baseUrl}/github/install?error=installation_not_found`
      );
    }

    // Check if this installation already exists for this user
    const existing = await db
      .select()
      .from(githubInstallation)
      .where(
        and(
          eq(githubInstallation.userId, session.user.id),
          eq(githubInstallation.installationId, installation.id)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing installation
      await db
        .update(githubInstallation)
        .set({
          accountLogin: installation.account.login,
          accountType: installation.account.type,
          repositorySelection: installation.repository_selection,
          updatedAt: new Date(),
        })
        .where(eq(githubInstallation.id, existing[0].id));
    } else {
      // Create new installation record
      await db.insert(githubInstallation).values({
        id: randomBytes(16).toString("hex"),
        installationId: installation.id,
        userId: session.user.id,
        accountLogin: installation.account.login,
        accountType: installation.account.type,
        repositorySelection: installation.repository_selection,
      });
    }

    return NextResponse.redirect(`${baseUrl}/github/install`);
  } catch (err) {
    console.error("GitHub install callback error:", err);
    return NextResponse.redirect(
      `${baseUrl}/github/install?error=callback_failed`
    );
  }
}
