// OAuth provider configurations for external service connections
// These are NOT for user login - they're for connecting user's external accounts

export const oauthProviders = {
  google: {
    name: "Google",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scopes: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
  microsoft: {
    name: "Microsoft",
    authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    scopes: [
      "offline_access",
      "https://graph.microsoft.com/Mail.Read",
      "https://graph.microsoft.com/Mail.Send",
      "https://graph.microsoft.com/Calendars.ReadWrite",
    ],
    clientId: process.env.MICROSOFT_CLIENT_ID!,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
  },
  spotify: {
    name: "Spotify",
    authUrl: "https://accounts.spotify.com/authorize",
    tokenUrl: "https://accounts.spotify.com/api/token",
    scopes: [
      "user-read-private",
      "user-read-email",
      "playlist-read-private",
      "playlist-modify-public",
      "playlist-modify-private",
      "user-library-read",
      "user-read-playback-state",
      "user-modify-playback-state",
    ],
    clientId: process.env.SPOTIFY_CLIENT_ID!,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  },
  slack: {
    name: "Slack",
    authUrl: "https://slack.com/oauth/v2/authorize",
    tokenUrl: "https://slack.com/api/oauth.v2.access",
    scopes: [
      "channels:history",
      "channels:read",
      "chat:write",
      "groups:history",
      "groups:read",
      "im:history",
      "im:read",
      "mpim:history",
      "mpim:read",
      "users:read",
      "users:read.email",
    ],
    clientId: process.env.SLACK_CLIENT_ID!,
    clientSecret: process.env.SLACK_CLIENT_SECRET!,
  },
  notion: {
    name: "Notion",
    authUrl: "https://api.notion.com/v1/oauth/authorize",
    tokenUrl: "https://api.notion.com/v1/oauth/token",
    scopes: [], // Notion doesn't use scopes - permissions are granted per-page
    clientId: process.env.NOTION_CLIENT_ID!,
    clientSecret: process.env.NOTION_CLIENT_SECRET!,
  },
  linear: {
    name: "Linear",
    authUrl: "https://linear.app/oauth/authorize",
    tokenUrl: "https://api.linear.app/oauth/token",
    scopes: [
      "read",
      "write",
      "issues:create",
      "comments:create",
    ],
    clientId: process.env.LINEAR_CLIENT_ID!,
    clientSecret: process.env.LINEAR_CLIENT_SECRET!,
  },
} as const;

export type OAuthProvider = keyof typeof oauthProviders;

export function buildAuthUrl(provider: OAuthProvider, state: string, redirectUri: string): string {
  const config = oauthProviders[provider];

  // Slack uses user_scope instead of scope for user tokens
  if (provider === "slack") {
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      user_scope: config.scopes.join(" "),
      state,
    });
    return `${config.authUrl}?${params.toString()}`;
  }

  // Notion needs owner=user parameter
  if (provider === "notion") {
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      owner: "user",
      state,
    });
    return `${config.authUrl}?${params.toString()}`;
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: config.scopes.join(" "),
    state,
    access_type: "offline", // For Google refresh tokens
    prompt: "consent", // Force consent to get refresh token
  });

  return `${config.authUrl}?${params.toString()}`;
}

export async function exchangeCodeForTokens(
  provider: OAuthProvider,
  code: string,
  redirectUri: string
): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  scope: string;
}> {
  const config = oauthProviders[provider];

  // Notion uses Basic auth and JSON body
  if (provider === "notion") {
    const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
    const response = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: undefined, // Notion doesn't use refresh tokens
      expiresIn: 365 * 24 * 60 * 60, // Notion tokens don't expire
      scope: "",
    };
  }

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  const data = await response.json();

  // Slack returns authed_user.access_token for user tokens
  if (provider === "slack" && data.authed_user) {
    return {
      accessToken: data.authed_user.access_token,
      refreshToken: data.authed_user.refresh_token,
      expiresIn: data.authed_user.expires_in || 43200, // 12 hours default
      scope: data.authed_user.scope || "",
    };
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in || 3600,
    scope: data.scope || "",
  };
}

export async function refreshAccessToken(
  provider: OAuthProvider,
  refreshToken: string
): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}> {
  const config = oauthProviders[provider];

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token, // Some providers return new refresh token
    expiresIn: data.expires_in,
  };
}
