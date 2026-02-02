import { getApiKey, getBaseUrl } from "../config.js";

export async function status(): Promise<void> {
  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();

  console.log(
    JSON.stringify({
      authenticated: !!apiKey,
      base_url: baseUrl,
    })
  );
}
