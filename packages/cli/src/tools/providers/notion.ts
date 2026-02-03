import type { ToolDefinition } from "../types.js";
import { parseNumber } from "../utils.js";

const NOTION_PROVIDER = "notion";

export const notionTools: ToolDefinition[] = [
  {
    id: "notion.search",
    commandPath: ["notion", "search"],
    description: "Search Notion pages and databases.",
    provider: NOTION_PROVIDER,
    options: [
      {
        key: "query",
        flags: "--query <text>",
        description: "Search query",
      },
      {
        key: "pageSize",
        flags: "--page-size <n>",
        description: "Number of results per page",
        parser: parseNumber,
      },
    ],
    run: (args) => ({
      provider: NOTION_PROVIDER,
      path: "v1/search",
      method: "POST",
      body: {
        query: args.query,
        page_size: args.pageSize,
      },
    }),
    examples: ["patchin notion search --query \"meeting notes\""],
  },
  {
    id: "notion.database.get",
    commandPath: ["notion", "database", "get"],
    description: "Get a Notion database.",
    provider: NOTION_PROVIDER,
    options: [
      {
        key: "id",
        flags: "--id <databaseId>",
        description: "Database ID",
        required: true,
      },
    ],
    run: (args) => ({
      provider: NOTION_PROVIDER,
      path: `v1/databases/${args.id}`,
      method: "GET",
    }),
    examples: ["patchin notion database get --id DATABASE_ID"],
  },
  {
    id: "notion.database.query",
    commandPath: ["notion", "database", "query"],
    description: "Query a Notion database.",
    provider: NOTION_PROVIDER,
    options: [
      {
        key: "id",
        flags: "--id <databaseId>",
        description: "Database ID",
        required: true,
      },
      {
        key: "filter",
        flags: "--filter <json>",
        description: "Filter JSON",
      },
      {
        key: "sorts",
        flags: "--sorts <json>",
        description: "Sorts JSON",
      },
    ],
    run: (args) => ({
      provider: NOTION_PROVIDER,
      path: `v1/databases/${args.id}/query`,
      method: "POST",
      body: {
        filter: args.filter ? JSON.parse(args.filter as string) : undefined,
        sorts: args.sorts ? JSON.parse(args.sorts as string) : undefined,
      },
    }),
    examples: ["patchin notion database query --id DATABASE_ID"],
  },
  {
    id: "notion.page.get",
    commandPath: ["notion", "page", "get"],
    description: "Get a Notion page.",
    provider: NOTION_PROVIDER,
    options: [
      {
        key: "id",
        flags: "--id <pageId>",
        description: "Page ID",
        required: true,
      },
    ],
    run: (args) => ({
      provider: NOTION_PROVIDER,
      path: `v1/pages/${args.id}`,
      method: "GET",
    }),
    examples: ["patchin notion page get --id PAGE_ID"],
  },
  {
    id: "notion.block.children",
    commandPath: ["notion", "block", "children"],
    description: "List children for a Notion block.",
    provider: NOTION_PROVIDER,
    options: [
      {
        key: "id",
        flags: "--id <blockId>",
        description: "Block ID",
        required: true,
      },
    ],
    run: (args) => ({
      provider: NOTION_PROVIDER,
      path: `v1/blocks/${args.id}/children`,
      method: "GET",
    }),
    examples: ["patchin notion block children --id BLOCK_ID"],
  },
];
