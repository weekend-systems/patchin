import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { buildAuthUrl, oauthProviders, OAuthProvider } from "@/lib/oauth-providers";
import { randomBytes } from "crypto";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const searchParams = request.nextUrl.searchParams;
  const customRedirect = searchParams.get("redirect");

  // Validate provider
  if (!Object.keys(oauthProviders).includes(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  // Check if user is authenticated
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Generate state with user ID for CSRF protection
  const state = `${session.user.id}:${randomBytes(16).toString("hex")}`;

  // Build redirect URI
  const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/connect/${provider}/callback`;

  // Build OAuth URL
  const authUrl = buildAuthUrl(provider as OAuthProvider, state, redirectUri);

  // Store state in cookie for verification
  const response = NextResponse.redirect(authUrl);
  response.cookies.set(`oauth_state_${provider}`, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
  });

  // Store custom redirect if provided (for setup flow)
  if (customRedirect) {
    response.cookies.set(`oauth_redirect_${provider}`, customRedirect, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
    });
  }

  return response;
}
