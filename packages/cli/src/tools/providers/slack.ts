import type { ToolDefinition } from "../types.js";
import { parseNumber } from "../utils.js";

const SLACK_PROVIDER = "slack";

export const slackTools: ToolDefinition[] = [
  {
    id: "slack.channels.list",
    commandPath: ["slack", "channels", "list"],
    description: "List Slack channels.",
    provider: SLACK_PROVIDER,
    options: [
      {
        key: "types",
        flags: "--types <types>",
        description: "Channel types (comma-separated)",
      },
      {
        key: "limit",
        flags: "--limit <n>",
        description: "Maximum number of channels",
        parser: parseNumber,
      },
    ],
    run: (args) => {
      const query: Record<string, string | number> = {};
      if (args.types) query.types = args.types as string;
      if (args.limit) query.limit = args.limit as number;

      return {
        provider: SLACK_PROVIDER,
        path: "conversations.list",
        method: "GET",
        query,
      };
    },
    examples: ["patchin slack channels list --types public_channel,private_channel"],
  },
  {
    id: "slack.channel.history",
    commandPath: ["slack", "channel", "history"],
    description: "Fetch Slack channel message history.",
    provider: SLACK_PROVIDER,
    options: [
      {
        key: "channel",
        flags: "--channel <id>",
        description: "Channel ID",
        required: true,
      },
      {
        key: "limit",
        flags: "--limit <n>",
        description: "Maximum number of messages",
        parser: parseNumber,
      },
    ],
    run: (args) => {
      const query: Record<string, string | number> = {
        channel: args.channel as string,
      };
      if (args.limit) query.limit = args.limit as number;

      return {
        provider: SLACK_PROVIDER,
        path: "conversations.history",
        method: "GET",
        query,
      };
    },
    examples: ["patchin slack channel history --channel C123456"],
  },
  {
    id: "slack.message.send",
    commandPath: ["slack", "message", "send"],
    description: "Send a Slack message.",
    provider: SLACK_PROVIDER,
    options: [
      {
        key: "channel",
        flags: "--channel <id>",
        description: "Channel ID",
        required: true,
      },
      {
        key: "text",
        flags: "--text <text>",
        description: "Message text",
        required: true,
      },
    ],
    run: (args) => ({
      provider: SLACK_PROVIDER,
      path: "chat.postMessage",
      method: "POST",
      body: {
        channel: args.channel,
        text: args.text,
      },
    }),
    examples: ["patchin slack message send --channel C123456 --text \"Hello\""],
  },
  {
    id: "slack.users.list",
    commandPath: ["slack", "users", "list"],
    description: "List Slack users.",
    provider: SLACK_PROVIDER,
    options: [
      {
        key: "limit",
        flags: "--limit <n>",
        description: "Maximum number of users",
        parser: parseNumber,
      },
    ],
    run: (args) => {
      const query: Record<string, string | number> = {};
      if (args.limit) query.limit = args.limit as number;

      return {
        provider: SLACK_PROVIDER,
        path: "users.list",
        method: "GET",
        query,
      };
    },
    examples: ["patchin slack users list --limit 50"],
  },
];
