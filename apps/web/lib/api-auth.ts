import { NextRequest } from "next/server";
import { db, apiKey, connectedAccount } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { hashApiKey, decryptToken, encryptToken } from "@/lib/crypto";
import { refreshAccessToken, OAuthProvider } from "@/lib/oauth-providers";

export async function validateApiKey(request: NextRequest): Promise<{
  valid: boolean;
  userId?: string;
  keyId?: string;
  error?: string;
}> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { valid: false, error: "Missing or invalid authorization header" };
  }

  const key = authHeader.slice(7);
  const keyHash = hashApiKey(key);

  const result = await db
    .select()
    .from(apiKey)
    .where(eq(apiKey.keyHash, keyHash))
    .limit(1);

  if (result.length === 0) {
    return { valid: false, error: "Invalid API key" };
  }

  const foundKey = result[0];

  // Check expiration
  if (foundKey.expiresAt && foundKey.expiresAt < new Date()) {
    return { valid: false, error: "API key expired" };
  }

  // Update last used timestamp
  await db
    .update(apiKey)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKey.id, foundKey.id));

  return {
    valid: true,
    userId: foundKey.userId,
    keyId: foundKey.id,
  };
}

export async function getAccessToken(
  userId: string,
  provider: OAuthProvider
): Promise<{ token: string } | { error: string }> {
  const accounts = await db
    .select()
    .from(connectedAccount)
    .where(
      and(
        eq(connectedAccount.userId, userId),
        eq(connectedAccount.provider, provider)
      )
    )
    .limit(1);

  const account = accounts[0];

  if (!account) {
    return { error: `No ${provider} account connected` };
  }

  // Check if token is expired (with 5 minute buffer)
  const isExpired =
    account.accessTokenExpiresAt &&
    account.accessTokenExpiresAt < new Date(Date.now() + 5 * 60 * 1000);

  if (isExpired && account.refreshTokenEncrypted) {
    try {
      // Refresh the token
      const refreshToken = decryptToken(account.refreshTokenEncrypted);
      const newTokens = await refreshAccessToken(provider, refreshToken);

      // Update stored tokens
      const accessTokenEncrypted = encryptToken(newTokens.accessToken);
      const refreshTokenEncrypted = newTokens.refreshToken
        ? encryptToken(newTokens.refreshToken)
        : account.refreshTokenEncrypted;
      const accessTokenExpiresAt = new Date(
        Date.now() + newTokens.expiresIn * 1000
      );

      await db
        .update(connectedAccount)
        .set({
          accessTokenEncrypted,
          refreshTokenEncrypted,
          accessTokenExpiresAt,
          updatedAt: new Date(),
        })
        .where(eq(connectedAccount.id, account.id));

      return { token: newTokens.accessToken };
    } catch (err) {
      console.error("Token refresh failed:", err);
      return { error: "Token refresh failed - please reconnect your account" };
    }
  }

  // Return decrypted token
  return { token: decryptToken(account.accessTokenEncrypted) };
}
