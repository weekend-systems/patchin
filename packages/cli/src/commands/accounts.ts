import { getApiKey, getBaseUrl } from "../config.js";
import { notAuthenticated, networkError, apiError } from "../errors.js";

interface Account {
  provider: string;
  providerEmail: string | null;
  createdAt: string;
}

interface AccountsResponse {
  accounts: Account[];
  error?: string;
}

export async function accounts(): Promise<void> {
  const apiKey = getApiKey();
  if (!apiKey) {
    notAuthenticated();
  }

  const baseUrl = getBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/v1/accounts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        notAuthenticated();
      }
      apiError("Failed to fetch accounts", response.status);
    }

    const data = (await response.json()) as AccountsResponse;
    console.log(JSON.stringify(data));
  } catch (err) {
    if (err instanceof Error && err.message.includes("fetch")) {
      networkError(`Could not reach ${baseUrl}`);
    }
    throw err;
  }
}
