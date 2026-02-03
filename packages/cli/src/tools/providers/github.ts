import type { ToolDefinition } from "../types.js";
import { parseNumber } from "../utils.js";

const GITHUB_PROVIDER = "github";

export const githubTools: ToolDefinition[] = [
  {
    id: "github.repos.list",
    commandPath: ["github", "repos", "list"],
    description: "List GitHub repositories for the user.",
    provider: GITHUB_PROVIDER,
    options: [
      {
        key: "type",
        flags: "--type <type>",
        description: "Repository type (all, owner, member)",
      },
      {
        key: "perPage",
        flags: "--per-page <n>",
        description: "Number of repos per page",
        parser: parseNumber,
      },
    ],
    run: (args) => {
      const query: Record<string, string | number> = {};
      if (args.type) query.type = args.type as string;
      if (args.perPage) query.per_page = args.perPage as number;

      return {
        provider: GITHUB_PROVIDER,
        path: "user/repos",
        method: "GET",
        query,
      };
    },
    examples: ["patchin github repos list --type owner"],
  },
  {
    id: "github.repo.get",
    commandPath: ["github", "repo", "get"],
    description: "Get GitHub repository details.",
    provider: GITHUB_PROVIDER,
    options: [
      {
        key: "owner",
        flags: "--owner <name>",
        description: "Repository owner",
        required: true,
      },
      {
        key: "repo",
        flags: "--repo <name>",
        description: "Repository name",
        required: true,
      },
    ],
    run: (args) => ({
      provider: GITHUB_PROVIDER,
      path: `repos/${args.owner}/${args.repo}`,
      method: "GET",
    }),
    examples: ["patchin github repo get --owner org --repo project"],
  },
  {
    id: "github.issues.list",
    commandPath: ["github", "issues", "list"],
    description: "List GitHub issues for a repository.",
    provider: GITHUB_PROVIDER,
    options: [
      {
        key: "owner",
        flags: "--owner <name>",
        description: "Repository owner",
        required: true,
      },
      {
        key: "repo",
        flags: "--repo <name>",
        description: "Repository name",
        required: true,
      },
      {
        key: "state",
        flags: "--state <state>",
        description: "Issue state (open, closed, all)",
      },
    ],
    run: (args) => {
      const query: Record<string, string> = {};
      if (args.state) query.state = args.state as string;

      return {
        provider: GITHUB_PROVIDER,
        path: `repos/${args.owner}/${args.repo}/issues`,
        method: "GET",
        query,
      };
    },
    examples: ["patchin github issues list --owner org --repo project --state open"],
  },
  {
    id: "github.issue.create",
    commandPath: ["github", "issue", "create"],
    description: "Create a GitHub issue.",
    provider: GITHUB_PROVIDER,
    options: [
      {
        key: "owner",
        flags: "--owner <name>",
        description: "Repository owner",
        required: true,
      },
      {
        key: "repo",
        flags: "--repo <name>",
        description: "Repository name",
        required: true,
      },
      {
        key: "title",
        flags: "--title <text>",
        description: "Issue title",
        required: true,
      },
      {
        key: "body",
        flags: "--body <text>",
        description: "Issue body",
      },
    ],
    run: (args) => ({
      provider: GITHUB_PROVIDER,
      path: `repos/${args.owner}/${args.repo}/issues`,
      method: "POST",
      body: {
        title: args.title,
        body: args.body,
      },
    }),
    examples: ["patchin github issue create --owner org --repo project --title \"Bug\""],
  },
  {
    id: "github.prs.list",
    commandPath: ["github", "prs", "list"],
    description: "List GitHub pull requests for a repository.",
    provider: GITHUB_PROVIDER,
    options: [
      {
        key: "owner",
        flags: "--owner <name>",
        description: "Repository owner",
        required: true,
      },
      {
        key: "repo",
        flags: "--repo <name>",
        description: "Repository name",
        required: true,
      },
      {
        key: "state",
        flags: "--state <state>",
        description: "PR state (open, closed, all)",
      },
    ],
    run: (args) => {
      const query: Record<string, string> = {};
      if (args.state) query.state = args.state as string;

      return {
        provider: GITHUB_PROVIDER,
        path: `repos/${args.owner}/${args.repo}/pulls`,
        method: "GET",
        query,
      };
    },
    examples: ["patchin github prs list --owner org --repo project"],
  },
  {
    id: "github.notifications.list",
    commandPath: ["github", "notifications", "list"],
    description: "List GitHub notifications.",
    provider: GITHUB_PROVIDER,
    run: () => ({
      provider: GITHUB_PROVIDER,
      path: "notifications",
      method: "GET",
    }),
    examples: ["patchin github notifications list"],
  },
];
