import { Command } from "commander";
import { login } from "./commands/login.js";
import { logout } from "./commands/logout.js";
import { status } from "./commands/status.js";
import { accounts } from "./commands/accounts.js";
import { requestUrl } from "./http.js";
import { invalidArgs } from "./errors.js";
import { collectOption } from "./utils/cli.js";
import { registerToolCommands } from "./tools/cli.js";

export function run(): void {
  const program = new Command();

  program
    .name("patchin")
    .description("Token-efficient CLI for Patchin API access")
    .version("0.1.0")
    .showHelpAfterError()
    .showSuggestionAfterError();

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

  program
    .command("url")
    .description("Make a request to an explicit URL")
    .argument("<url>", "Full URL or path (relative to base URL)")
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
        url: string,
        options: {
          method: string;
          data?: string;
          query: string[];
          header: string[];
          raw: boolean;
        }
      ) => {
        const headers = parseHeaders(options.header);
        await requestUrl(url, {
          method: options.method.toUpperCase(),
          data: options.data,
          query: options.query,
          headers,
          raw: options.raw,
        });
      }
    );

  registerToolCommands(program);

  if (process.argv.length <= 2) {
    program.help();
  }
  program.parse(process.argv);
}

function parseHeaders(headers: string[]): Record<string, string> {
  const parsed: Record<string, string> = {};
  for (const header of headers) {
    const [key, ...valueParts] = header.split(":");
    const value = valueParts.join(":").trim();
    if (!key || !value) {
      invalidArgs(`Invalid header format: ${header}`);
    }
    parsed[key] = value;
  }
  return parsed;
}
