import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, getAccessToken } from "@/lib/api-auth";
import { oauthProviders, OAuthProvider } from "@/lib/oauth-providers";
import { db, apiUsage } from "@/lib/db";
import { randomBytes } from "crypto";

const PROVIDER_BASE_URLS: Record<OAuthProvider, string> = {
  google: "https://www.googleapis.com",
  microsoft: "https://graph.microsoft.com",
  spotify: "https://api.spotify.com",
  slack: "https://slack.com/api",
  notion: "https://api.notion.com",
  linear: "https://api.linear.app",
};

async function handleRequest(
  request: NextRequest,
  context: { params: Promise<{ provider: string; path: string[] }> }
) {
  const { provider, path } = await context.params;

  // Validate provider
  if (!Object.keys(oauthProviders).includes(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  // Validate API key
  const authResult = await validateApiKey(request);
  if (!authResult.valid) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  // Get access token for provider
  const accountHint = request.headers.get("x-patchin-account") || undefined;
  const tokenResult = await getAccessToken(
    authResult.userId!,
    provider as OAuthProvider,
    accountHint
  );
  if ("error" in tokenResult) {
    return NextResponse.json({ error: tokenResult.error }, { status: 403 });
  }

  // Build target URL
  const baseUrl = PROVIDER_BASE_URLS[provider as OAuthProvider];
  const targetPath = path.join("/");
  const targetUrl = new URL(`${baseUrl}/${targetPath}`);

  // Forward query parameters
  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  // Prepare headers
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${tokenResult.token}`);
  headers.set("Content-Type", request.headers.get("Content-Type") || "application/json");

  // Provider-specific headers
  if (provider === "notion") {
    headers.set("Notion-Version", "2022-06-28");
  }

  // Forward the request
  let response: Response;
  let statusCode: number;
  try {
    response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers,
      body: request.method !== "GET" && request.method !== "HEAD"
        ? await request.text()
        : undefined,
    });
    statusCode = response.status;
  } catch (err) {
    console.error("Proxy request failed:", err);
    statusCode = 500;

    // Log usage
    await logUsage(authResult.keyId!, provider, targetPath, statusCode);

    return NextResponse.json(
      { error: "Failed to reach provider API" },
      { status: 502 }
    );
  }

  // Log usage
  await logUsage(authResult.keyId!, provider, targetPath, statusCode);

  // Forward response
  const responseBody = await response.text();
  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json",
    },
  });
}

async function logUsage(
  keyId: string,
  provider: string,
  endpoint: string,
  statusCode: number
) {
  try {
    await db.insert(apiUsage).values({
      id: randomBytes(16).toString("hex"),
      apiKeyId: keyId,
      provider,
      endpoint,
      statusCode,
    });
  } catch (err) {
    console.error("Failed to log usage:", err);
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
