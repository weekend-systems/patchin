import { NextResponse } from "next/server";
import { oauthProviders, OAuthProvider } from "@/lib/oauth-providers";

// Returns which providers are configured (have client IDs set)
export async function GET() {
  const configured: Record<string, boolean> = {};

  for (const provider of Object.keys(oauthProviders) as OAuthProvider[]) {
    const config = oauthProviders[provider];
    // Check if client ID is set and not empty/undefined
    configured[provider] = !!(config.clientId && config.clientId !== "undefined");
  }

  return NextResponse.json({ providers: configured });
}
