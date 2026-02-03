import { googleTools } from "./providers/google.js";
import { microsoftTools } from "./providers/microsoft.js";
import { slackTools } from "./providers/slack.js";
import { notionTools } from "./providers/notion.js";
import { linearTools } from "./providers/linear.js";
import { githubTools } from "./providers/github.js";
import { spotifyTools } from "./providers/spotify.js";
import { youtubeTools } from "./providers/youtube.js";
import { stravaTools } from "./providers/strava.js";
import type { ToolDefinition } from "./types.js";

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  ...googleTools,
  ...microsoftTools,
  ...slackTools,
  ...notionTools,
  ...linearTools,
  ...githubTools,
  ...spotifyTools,
  ...youtubeTools,
  ...stravaTools,
];
