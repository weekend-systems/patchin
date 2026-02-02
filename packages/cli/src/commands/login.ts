import { getBaseUrl, saveConfig } from "../config.js";
import { networkError, apiError, authExpired } from "../errors.js";

const POLL_INTERVAL_MS = 5000;

interface DeviceAuthResponse {
  device_code: string;
  verification_url: string;
  expires_in: number;
  interval: number;
}

interface TokenPollResponse {
  status: "pending" | "completed" | "expired";
  api_key?: string;
  error?: string;
}

export async function login(): Promise<void> {
  const baseUrl = getBaseUrl();

  // Initiate device auth flow
  let deviceAuth: DeviceAuthResponse;
  try {
    const response = await fetch(`${baseUrl}/api/auth/device`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      apiError("Failed to initiate login", response.status);
    }

    deviceAuth = (await response.json()) as DeviceAuthResponse;
  } catch (err) {
    if (err instanceof Error && err.message.includes("fetch")) {
      networkError(`Could not reach ${baseUrl}`);
    }
    throw err;
  }

  // Output awaiting authorization status
  console.log(
    JSON.stringify({
      status: "awaiting_authorization",
      verification_url: deviceAuth.verification_url,
    })
  );

  // Poll for completion
  const pollInterval = (deviceAuth.interval || 5) * 1000;
  const maxAttempts = Math.ceil(
    (deviceAuth.expires_in * 1000) / pollInterval
  );

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await sleep(pollInterval);

    try {
      const response = await fetch(`${baseUrl}/api/auth/device/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_code: deviceAuth.device_code }),
      });

      if (!response.ok) {
        continue; // Retry on error
      }

      const result = (await response.json()) as TokenPollResponse;

      if (result.status === "completed" && result.api_key) {
        // Save the API key
        saveConfig({ api_key: result.api_key });

        console.log(JSON.stringify({ status: "authenticated" }));
        return;
      }

      if (result.status === "expired") {
        authExpired();
      }

      // Still pending, continue polling
    } catch {
      // Retry on network errors
      continue;
    }
  }

  authExpired();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
