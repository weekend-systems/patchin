export type ErrorCode =
  | "not_authenticated"
  | "provider_not_connected"
  | "auth_expired"
  | "api_error"
  | "network_error"
  | "invalid_args";

export interface CliError {
  error: ErrorCode;
  message: string;
  hint?: string;
}

export function outputError(error: CliError): never {
  console.error(JSON.stringify(error));
  process.exit(1);
}

export function notAuthenticated(): never {
  outputError({
    error: "not_authenticated",
    message: "Not logged in",
    hint: "Run: patchin login",
  });
}

export function providerNotConnected(provider: string): never {
  outputError({
    error: "provider_not_connected",
    message: `No ${provider} account connected`,
    hint: `Connect your account at patchin.sh/dashboard`,
  });
}

export function authExpired(): never {
  outputError({
    error: "auth_expired",
    message: "Authentication expired",
    hint: "Run: patchin login",
  });
}

export function apiError(message: string, statusCode?: number): never {
  outputError({
    error: "api_error",
    message: statusCode ? `${message} (${statusCode})` : message,
  });
}

export function networkError(message: string): never {
  outputError({
    error: "network_error",
    message,
  });
}

export function invalidArgs(message: string): never {
  outputError({
    error: "invalid_args",
    message,
  });
}
