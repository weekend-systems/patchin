import type { ToolDefinition } from "../types.js";
import { parseNumber } from "../utils.js";

const STRAVA_PROVIDER = "strava";

export const stravaTools: ToolDefinition[] = [
  {
    id: "strava.athlete.get",
    commandPath: ["strava", "athlete", "get"],
    description: "Get the current Strava athlete profile.",
    provider: STRAVA_PROVIDER,
    run: () => ({
      provider: STRAVA_PROVIDER,
      path: "athlete",
      method: "GET",
    }),
    examples: ["patchin strava athlete get"],
  },
  {
    id: "strava.activities.list",
    commandPath: ["strava", "activities", "list"],
    description: "List Strava activities for the current athlete.",
    provider: STRAVA_PROVIDER,
    options: [
      {
        key: "after",
        flags: "--after <epoch>",
        description: "Return activities after this epoch timestamp",
        parser: parseNumber,
      },
      {
        key: "before",
        flags: "--before <epoch>",
        description: "Return activities before this epoch timestamp",
        parser: parseNumber,
      },
      {
        key: "perPage",
        flags: "--per-page <n>",
        description: "Number of activities per page",
        parser: parseNumber,
      },
    ],
    run: (args) => {
      const query: Record<string, number> = {};
      if (args.after) query.after = args.after as number;
      if (args.before) query.before = args.before as number;
      if (args.perPage) query.per_page = args.perPage as number;

      return {
        provider: STRAVA_PROVIDER,
        path: "athlete/activities",
        method: "GET",
        query,
      };
    },
    examples: ["patchin strava activities list --per-page 10"],
  },
  {
    id: "strava.activity.get",
    commandPath: ["strava", "activity", "get"],
    description: "Get a Strava activity by ID.",
    provider: STRAVA_PROVIDER,
    options: [
      {
        key: "id",
        flags: "--id <activityId>",
        description: "Activity ID",
        required: true,
      },
    ],
    run: (args) => ({
      provider: STRAVA_PROVIDER,
      path: `activities/${args.id}`,
      method: "GET",
    }),
    examples: ["patchin strava activity get --id 123456"],
  },
];
