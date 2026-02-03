import type { ToolDefinition } from "../types.js";
import { parseNumber } from "../utils.js";

const YOUTUBE_PROVIDER = "youtube";

export const youtubeTools: ToolDefinition[] = [
  {
    id: "youtube.playlists.list",
    commandPath: ["youtube", "playlists", "list"],
    description: "List YouTube playlists for the current user.",
    provider: YOUTUBE_PROVIDER,
    options: [
      {
        key: "maxResults",
        flags: "--max-results <n>",
        description: "Maximum number of playlists",
        parser: parseNumber,
      },
    ],
    run: (args) => {
      const query: Record<string, string | number | boolean> = {
        mine: true,
        part: "snippet",
      };
      if (args.maxResults) query.maxResults = args.maxResults as number;

      return {
        provider: YOUTUBE_PROVIDER,
        path: "youtube/v3/playlists",
        method: "GET",
        query,
      };
    },
    examples: ["patchin youtube playlists list --max-results 5"],
  },
  {
    id: "youtube.subscriptions.list",
    commandPath: ["youtube", "subscriptions", "list"],
    description: "List YouTube subscriptions for the current user.",
    provider: YOUTUBE_PROVIDER,
    options: [
      {
        key: "maxResults",
        flags: "--max-results <n>",
        description: "Maximum number of subscriptions",
        parser: parseNumber,
      },
    ],
    run: (args) => {
      const query: Record<string, string | number | boolean> = {
        mine: true,
        part: "snippet",
      };
      if (args.maxResults) query.maxResults = args.maxResults as number;

      return {
        provider: YOUTUBE_PROVIDER,
        path: "youtube/v3/subscriptions",
        method: "GET",
        query,
      };
    },
    examples: ["patchin youtube subscriptions list --max-results 10"],
  },
  {
    id: "youtube.search",
    commandPath: ["youtube", "search"],
    description: "Search YouTube videos.",
    provider: YOUTUBE_PROVIDER,
    options: [
      {
        key: "q",
        flags: "--q <query>",
        description: "Search query",
        required: true,
      },
      {
        key: "maxResults",
        flags: "--max-results <n>",
        description: "Maximum number of results",
        parser: parseNumber,
      },
    ],
    run: (args) => {
      const query: Record<string, string | number> = {
        part: "snippet",
        q: args.q as string,
      };
      if (args.maxResults) query.maxResults = args.maxResults as number;

      return {
        provider: YOUTUBE_PROVIDER,
        path: "youtube/v3/search",
        method: "GET",
        query,
      };
    },
    examples: ["patchin youtube search --q \"coding tutorial\" --max-results 5"],
  },
];
