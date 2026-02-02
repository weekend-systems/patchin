import { getApiKey, getBaseUrl } from "../config.js";
import {
  notAuthenticated,
  networkError,
  apiError,
  providerNotConnected,
} from "../errors.js";

export interface RequestOptions {
  method: string;
  data?: string;
  query: string[];
  headers: string[];
  raw: boolean;
}

export async function request(
  provider: string,
  path: string,
  options: RequestOptions
): Promise<void> {
  const apiKey = getApiKey();
  if (!apiKey) {
    notAuthenticated();
  }

  const baseUrl = getBaseUrl();

  // Build URL with query parameters
  const url = new URL(`${baseUrl}/api/v1/${provider}/${path}`);
  for (const q of options.query) {
    const [key, ...valueParts] = q.split("=");
    const value = valueParts.join("=");
    if (key && value !== undefined) {
      url.searchParams.set(key, value);
    }
  }

  // Build headers
  const reqHeaders: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
  };

  // Add custom headers
  for (const h of options.headers) {
    const [key, ...valueParts] = h.split(":");
    const value = valueParts.join(":").trim();
    if (key && value) {
      reqHeaders[key] = value;
    }
  }

  // Add content-type for requests with body
  if (options.data && !reqHeaders["Content-Type"]) {
    reqHeaders["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(url.toString(), {
      method: options.method,
      headers: reqHeaders,
      body: options.data || undefined,
    });

    const text = await response.text();

    if (!response.ok) {
      // Check for specific errors
      if (response.status === 401) {
        notAuthenticated();
      }
      if (response.status === 403) {
        try {
          const errorData = JSON.parse(text);
          if (errorData.error?.includes("No") && errorData.error?.includes("connected")) {
            providerNotConnected(provider);
          }
        } catch {
          // Not JSON, fall through
        }
        apiError(text || "Forbidden", response.status);
      }
      apiError(text || response.statusText, response.status);
    }

    if (options.raw) {
      console.log(text);
    } else {
      // Try to parse and re-format JSON
      try {
        const json = JSON.parse(text);
        console.log(JSON.stringify(json));
      } catch {
        console.log(text);
      }
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("fetch")) {
      networkError(`Could not reach ${baseUrl}`);
    }
    throw err;
  }
}
