import { Command } from "commander";
import { login } from "./commands/login.js";
import { logout } from "./commands/logout.js";
import { status } from "./commands/status.js";
import { accounts } from "./commands/accounts.js";
import { request, RequestOptions } from "./commands/request.js";
import { invalidArgs } from "./errors.js";

const PROVIDERS = ["google", "microsoft", "spotify"];

export function run(): void {
  const program = new Command();

  program
    .name("patchin")
    .description("Token-efficient CLI for Patchin API access")
    .version("0.1.0");

  program
    .command("login")
    .description("Authenticate via device flow")
    .action(async () => {
      await login();
    });

  program
    .command("logout")
    .description("Remove stored credentials")
    .action(async () => {
      await logout();
    });

  program
    .command("status")
    .description("Show authentication status")
    .action(async () => {
      await status();
    });

  program
    .command("accounts")
    .description("List connected provider accounts")
    .action(async () => {
      await accounts();
    });

  // Provider request command - handles <provider> <path> pattern
  program
    .argument("[provider]", "Provider name (google, microsoft, spotify)")
    .argument("[path]", "API path")
    .option("-X, --method <method>", "HTTP method", "GET")
    .option("-d, --data <data>", "Request body (JSON)")
    .option(
      "-q, --query <param>",
      "Query parameter (key=value)",
      collectOption,
      []
    )
    .option(
      "-H, --header <header>",
      "Custom header (key: value)",
      collectOption,
      []
    )
    .option("-r, --raw", "Raw response output", false)
    .action(
      async (
        provider: string | undefined,
        path: string | undefined,
        options: {
          method: string;
          data?: string;
          query: string[];
          header: string[];
          raw: boolean;
        }
      ) => {
        // If no provider specified, show help
        if (!provider) {
          program.help();
          return;
        }

        // Check if it's a known subcommand that wasn't matched
        if (["login", "logout", "status", "accounts"].includes(provider)) {
          // Already handled by subcommands
          return;
        }

        // Validate provider
        if (!PROVIDERS.includes(provider)) {
          invalidArgs(
            `Unknown provider: ${provider}. Valid providers: ${PROVIDERS.join(", ")}`
          );
        }

        // Path is required for provider requests
        if (!path) {
          invalidArgs("API path is required");
        }

        const requestOptions: RequestOptions = {
          method: options.method.toUpperCase(),
          data: options.data,
          query: options.query,
          headers: options.header,
          raw: options.raw,
        };

        await request(provider, path, requestOptions);
      }
    );

  program.parse(process.argv);
}

function collectOption(value: string, previous: string[]): string[] {
  return previous.concat([value]);
}
