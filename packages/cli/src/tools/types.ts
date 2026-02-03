import type { QueryParams } from "../http.js";

export interface ToolOption {
  key: string;
  flags: string;
  description: string;
  required?: boolean;
  defaultValue?: unknown;
  collect?: boolean;
  parser?: (value: string) => unknown;
}

export interface ToolRequest {
  provider: string;
  path: string;
  method: string;
  query?: QueryParams;
  headers?: Record<string, string>;
  body?: unknown;
}

export interface ToolRunContext {
  fetchProviderJson: (provider: string, path: string) => Promise<unknown>;
}

export interface ToolDefinition {
  id: string;
  commandPath: string[];
  description: string;
  provider: string;
  options?: ToolOption[];
  examples?: string[];
  run: (args: Record<string, unknown>, ctx: ToolRunContext) => ToolRequest | Promise<ToolRequest>;
}
