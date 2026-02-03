import { Command } from "commander";
import { fetchProviderJson, requestProvider } from "../http.js";
import { invalidArgs } from "../errors.js";
import { collectOption } from "../utils/cli.js";
import { TOOL_DEFINITIONS } from "./registry.js";
import type { ToolDefinition, ToolOption } from "./types.js";

interface ToolListing {
  id: string;
  command: string;
  description: string;
  options: {
    flags: string;
    description: string;
    required: boolean;
    defaultValue?: unknown;
  }[];
  examples?: string[];
}

export function registerToolCommands(program: Command): void {
  const commandMap = new Map<string, Command>();

  for (const tool of TOOL_DEFINITIONS) {
    const command = buildCommand(program, commandMap, tool);
    attachOptions(command, tool.options ?? []);
    command.action(async (...args: unknown[]) => {
      const commandArg = args[args.length - 1] as Command;
      const options = commandArg.opts();
      await runTool(tool, options);
    });
  }

  program
    .command("tools")
    .description("List built-in tools")
    .action(() => {
      const listing = TOOL_DEFINITIONS.map(toListing);
      console.log(JSON.stringify({ tools: listing }));
    });
}

function buildCommand(
  program: Command,
  commandMap: Map<string, Command>,
  tool: ToolDefinition
): Command {
  let current = program;
  let pathKey = "";

  for (const segment of tool.commandPath) {
    pathKey = pathKey ? `${pathKey}.${segment}` : segment;
    let next = commandMap.get(pathKey);
    if (!next) {
      next = current.command(segment);
      commandMap.set(pathKey, next);
    }
    current = next;
  }

  current.description(tool.description);
  return current;
}

function attachOptions(command: Command, options: ToolOption[]): void {
  for (const option of options) {
    if (option.collect) {
      command.option(option.flags, option.description, collectOption, []);
      continue;
    }

    if (option.parser) {
      command.option(option.flags, option.description, option.parser, option.defaultValue);
      continue;
    }

    if (option.defaultValue !== undefined && option.defaultValue !== null) {
      command.option(
        option.flags,
        option.description,
        option.defaultValue as string | boolean | string[]
      );
      continue;
    }

    command.option(option.flags, option.description);
  }
}

async function runTool(
  tool: ToolDefinition,
  args: Record<string, unknown>
): Promise<void> {
  const missing = (tool.options ?? [])
    .filter((option) => option.required)
    .filter((option) => !isPresent(args[option.key]));

  if (missing.length > 0) {
    const names = missing.map((option) => option.flags.split(" ")[0]).join(", ");
    invalidArgs(`Missing required options: ${names}`);
  }

  let request;
  try {
    request = await tool.run(args, {
      fetchProviderJson,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid tool input";
    invalidArgs(message);
  }

  await requestProvider(request.provider, request.path, {
    method: request.method,
    data: request.body ? JSON.stringify(request.body) : undefined,
    query: request.query,
    headers: request.headers,
    raw: false,
  });
}

function isPresent(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && value !== "";
}

function toListing(tool: ToolDefinition): ToolListing {
  return {
    id: tool.id,
    command: tool.commandPath.join(" "),
    description: tool.description,
    options:
      tool.options?.map((option) => ({
        flags: option.flags,
        description: option.description,
        required: Boolean(option.required),
        defaultValue: option.defaultValue,
      })) ?? [],
    examples: tool.examples,
  };
}
