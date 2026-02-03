import type { ToolDefinition } from "../types.js";
import { parseNumber } from "../utils.js";

const LINEAR_PROVIDER = "linear";

export const linearTools: ToolDefinition[] = [
  {
    id: "linear.viewer",
    commandPath: ["linear", "viewer"],
    description: "Get the current Linear user.",
    provider: LINEAR_PROVIDER,
    run: () => ({
      provider: LINEAR_PROVIDER,
      path: "graphql",
      method: "POST",
      body: {
        query: "{ viewer { id name email } }",
      },
    }),
    examples: ["patchin linear viewer"],
  },
  {
    id: "linear.issues.list",
    commandPath: ["linear", "issues", "list"],
    description: "List Linear issues.",
    provider: LINEAR_PROVIDER,
    options: [
      {
        key: "limit",
        flags: "--limit <n>",
        description: "Maximum number of issues",
        parser: parseNumber,
      },
      {
        key: "state",
        flags: "--state <name>",
        description: "Filter by state name",
      },
    ],
    run: (args) => {
      const limit = (args.limit as number | undefined) ?? 10;
      const state = args.state as string | undefined;
      const filter = state ? `, filter: { state: { name: { eq: \"${state}\" } } }` : "";

      return {
        provider: LINEAR_PROVIDER,
        path: "graphql",
        method: "POST",
        body: {
          query: `{ issues(first: ${limit}${filter}) { nodes { id title state { name } } } }`,
        },
      };
    },
    examples: ["patchin linear issues list --limit 5"],
  },
  {
    id: "linear.issue.create",
    commandPath: ["linear", "issue", "create"],
    description: "Create a Linear issue.",
    provider: LINEAR_PROVIDER,
    options: [
      {
        key: "teamId",
        flags: "--team-id <id>",
        description: "Team ID",
        required: true,
      },
      {
        key: "title",
        flags: "--title <text>",
        description: "Issue title",
        required: true,
      },
      {
        key: "description",
        flags: "--description <text>",
        description: "Issue description",
      },
    ],
    run: (args) => {
      const description = args.description
        ? `, description: \"${(args.description as string).replace(/\"/g, '\\"')}\"`
        : "";

      return {
        provider: LINEAR_PROVIDER,
        path: "graphql",
        method: "POST",
        body: {
          query: `mutation { issueCreate(input: { teamId: \"${args.teamId}\", title: \"${(args.title as string).replace(/\"/g, '\\"')}\"${description} }) { issue { id title } } }`,
        },
      };
    },
    examples: ["patchin linear issue create --team-id TEAM_ID --title \"Bug\""],
  },
];
