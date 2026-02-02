import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { exchangeCodeForTokens, oauthProviders, OAuthProvider } from "@/lib/oauth-providers";
import { encryptToken } from "@/lib/crypto";
import { db, connectedAccount } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { randomBytes } from "crypto";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      `${baseUrl}/dashboard?error=${encodeURIComponent(error)}`
    );
  }

  // Validate provider
  if (!Object.keys(oauthProviders).includes(provider)) {
    return NextResponse.redirect(`${baseUrl}/dashboard?error=invalid_provider`);
  }

  // Validate code
  if (!code) {
    return NextResponse.redirect(`${baseUrl}/dashboard?error=missing_code`);
  }

  // Verify state
  const storedState = request.cookies.get(`oauth_state_${provider}`)?.value;
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${baseUrl}/dashboard?error=invalid_state`);
  }

  // Extract user ID from state
  const [userId] = state.split(":");

  // Verify user is still authenticated
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.id !== userId) {
    return NextResponse.redirect(`${baseUrl}/dashboard?error=session_mismatch`);
  }

  try {
    // Exchange code for tokens
    const redirectUri = `${baseUrl}/api/connect/${provider}/callback`;
    const tokens = await exchangeCodeForTokens(
      provider as OAuthProvider,
      code,
      redirectUri
    );

    // Get user info from provider to get account ID
    const userInfo = await getProviderUserInfo(provider as OAuthProvider, tokens.accessToken);

    // Encrypt tokens
    const accessTokenEncrypted = encryptToken(tokens.accessToken);
    const refreshTokenEncrypted = tokens.refreshToken
      ? encryptToken(tokens.refreshToken)
      : null;

    // Calculate expiration
    const accessTokenExpiresAt = new Date(Date.now() + tokens.expiresIn * 1000);

    // Check if account already exists
    const existing = await db
      .select()
      .from(connectedAccount)
      .where(
        and(
          eq(connectedAccount.userId, userId),
          eq(connectedAccount.provider, provider)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing account
      await db
        .update(connectedAccount)
        .set({
          accessTokenEncrypted,
          refreshTokenEncrypted,
          accessTokenExpiresAt,
          scope: tokens.scope,
          providerAccountId: userInfo.id,
          providerEmail: userInfo.email,
          updatedAt: new Date(),
        })
        .where(eq(connectedAccount.id, existing[0].id));
    } else {
      // Create new connected account
      await db.insert(connectedAccount).values({
        id: randomBytes(16).toString("hex"),
        userId,
        provider,
        providerAccountId: userInfo.id,
        providerEmail: userInfo.email,
        accessTokenEncrypted,
        refreshTokenEncrypted,
        accessTokenExpiresAt,
        scope: tokens.scope,
      });
    }

    // Clear state cookie and redirect
    const response = NextResponse.redirect(
      `${baseUrl}/dashboard?connected=${provider}`
    );
    response.cookies.delete(`oauth_state_${provider}`);
    return response;
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(
      `${baseUrl}/dashboard?error=token_exchange_failed`
    );
  }
}

async function getProviderUserInfo(
  provider: OAuthProvider,
  accessToken: string
): Promise<{ id: string; email?: string }> {
  switch (provider) {
    case "google": {
      const res = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await res.json();
      console.log("Google userinfo response:", JSON.stringify(data));
      if (!data.id) {
        throw new Error(`Google userinfo missing id: ${JSON.stringify(data)}`);
      }
      return { id: data.id, email: data.email };
    }
    case "microsoft": {
      const res = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      console.log("Microsoft userinfo response:", JSON.stringify(data));
      if (!data.id) {
        throw new Error(`Microsoft userinfo missing id: ${JSON.stringify(data)}`);
      }
      return { id: data.id, email: data.mail || data.userPrincipalName };
    }
    case "spotify": {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      console.log("Spotify userinfo response:", JSON.stringify(data));
      if (!data.id) {
        throw new Error(`Spotify userinfo missing id: ${JSON.stringify(data)}`);
      }
      return { id: data.id, email: data.email };
    }
  }
}
