import { getApiKey, getBaseUrl } from "./config.js";
import {
  notAuthenticated,
  networkError,
  apiError,
  providerNotConnected,
} from "./errors.js";

export interface RequestOptions {
  method: string;
  data?: string;
  headers?: Record<string, string>;
  raw: boolean;
  provider?: string;
}

export type QueryParamValue = string | number | boolean;
export type QueryParams = Record<string, QueryParamValue | QueryParamValue[]>;

export function resolveUrl(inputUrl: string, baseUrl: string): string {
  if (/^https?:\/\//i.test(inputUrl)) {
    return inputUrl;
  }

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = inputUrl.replace(/^\/+/, "");
  return `${normalizedBase}/${normalizedPath}`;
}

export function buildProviderUrl(provider: string, path: string): string {
  const baseUrl = getBaseUrl().replace(/\/+$/, "");
  const normalizedPath = path.replace(/^\/+/, "");
  return `${baseUrl}/api/v1/${provider}/${normalizedPath}`;
}

export function appendQueryParams(url: URL, query: QueryParams): void {
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(key, String(item));
      }
    } else if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }
}

export function appendQueryPairs(url: URL, queryPairs: string[]): void {
  for (const q of queryPairs) {
    const [key, ...valueParts] = q.split("=");
    const value = valueParts.join("=");
    if (key && value !== undefined) {
      url.searchParams.set(key, value);
    }
  }
}

export async function sendRequest(
  url: string,
  options: RequestOptions
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    notAuthenticated();
  }

  const reqHeaders: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    ...(options.headers ?? {}),
  };

  if (options.data && !reqHeaders["Content-Type"]) {
    reqHeaders["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(url, {
      method: options.method,
      headers: reqHeaders,
      body: options.data || undefined,
    });

    const text = await response.text();

    if (!response.ok) {
      if (response.status === 401) {
        notAuthenticated();
      }
      if (response.status === 403 && options.provider) {
        try {
          const errorData = JSON.parse(text);
          if (errorData.error?.includes("No") && errorData.error?.includes("connected")) {
            providerNotConnected(options.provider);
          }
        } catch {
          // Not JSON, fall through
        }
      }
      apiError(text || response.statusText, response.status);
    }

    return text;
  } catch (err) {
    if (err instanceof Error && err.message.includes("fetch")) {
      networkError(`Could not reach ${getBaseUrl()}`);
    }
    throw err;
  }
}

export function printResponse(text: string, raw: boolean): void {
  if (raw) {
    console.log(text);
    return;
  }

  try {
    const json = JSON.parse(text);
    console.log(JSON.stringify(json));
  } catch {
    console.log(text);
  }
}

export async function requestUrl(
  inputUrl: string,
  options: {
    method: string;
    data?: string;
    query: string[];
    headers: Record<string, string>;
    raw: boolean;
  }
): Promise<void> {
  const resolved = resolveUrl(inputUrl, getBaseUrl());
  const url = new URL(resolved);
  appendQueryPairs(url, options.query);

  const text = await sendRequest(url.toString(), {
    method: options.method,
    data: options.data,
    headers: options.headers,
    raw: options.raw,
  });

  printResponse(text, options.raw);
}

export async function requestProvider(
  provider: string,
  path: string,
  options: {
    method: string;
    data?: string;
    query?: QueryParams;
    headers?: Record<string, string>;
    raw: boolean;
  }
): Promise<void> {
  const url = new URL(buildProviderUrl(provider, path));
  if (options.query) {
    appendQueryParams(url, options.query);
  }

  const text = await sendRequest(url.toString(), {
    method: options.method,
    data: options.data,
    headers: options.headers,
    raw: options.raw,
    provider,
  });

  printResponse(text, options.raw);
}

export async function fetchProviderJson(
  provider: string,
  path: string
): Promise<unknown> {
  const url = buildProviderUrl(provider, path);
  const text = await sendRequest(url, {
    method: "GET",
    raw: true,
    provider,
  });

  return JSON.parse(text);
}
