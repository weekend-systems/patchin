import type { ToolDefinition } from "../types.js";
import { parseNumber } from "../utils.js";

const MICROSOFT_PROVIDER = "microsoft";

function buildRecipients(list: string[] | undefined) {
  return (list ?? []).map((email) => ({
    emailAddress: { address: email },
  }));
}

export const microsoftTools: ToolDefinition[] = [
  {
    id: "microsoft.email.list",
    commandPath: ["microsoft", "email", "list"],
    description: "List Outlook email messages.",
    provider: MICROSOFT_PROVIDER,
    options: [
      {
        key: "top",
        flags: "--top <n>",
        description: "Number of messages to return",
        parser: parseNumber,
      },
      {
        key: "folder",
        flags: "--folder <id>",
        description: "Mail folder ID (defaults to Inbox)",
      },
    ],
    run: (args) => {
      const folder = (args.folder as string | undefined) ?? "inbox";
      const query: Record<string, string | number> = {};
      if (args.top) query["$top"] = args.top as number;

      return {
        provider: MICROSOFT_PROVIDER,
        path: `me/mailFolders/${folder}/messages`,
        method: "GET",
        query,
      };
    },
    examples: ["patchin microsoft email list --top 10"],
  },
  {
    id: "microsoft.email.send",
    commandPath: ["microsoft", "email", "send"],
    description: "Send an Outlook email message.",
    provider: MICROSOFT_PROVIDER,
    options: [
      {
        key: "to",
        flags: "--to <email>",
        description: "Recipient email (repeatable)",
        required: true,
        collect: true,
      },
      {
        key: "subject",
        flags: "--subject <text>",
        description: "Email subject",
        required: true,
      },
      {
        key: "body",
        flags: "--body <text>",
        description: "Email body (plain text)",
        required: true,
      },
      {
        key: "cc",
        flags: "--cc <email>",
        description: "CC recipient (repeatable)",
        collect: true,
      },
      {
        key: "bcc",
        flags: "--bcc <email>",
        description: "BCC recipient (repeatable)",
        collect: true,
      },
    ],
    run: (args) => ({
      provider: MICROSOFT_PROVIDER,
      path: "me/sendMail",
      method: "POST",
      body: {
        message: {
          subject: args.subject,
          body: {
            contentType: "Text",
            content: args.body,
          },
          toRecipients: buildRecipients(args.to as string[]),
          ccRecipients: buildRecipients(args.cc as string[] | undefined),
          bccRecipients: buildRecipients(args.bcc as string[] | undefined),
        },
        saveToSentItems: true,
      },
    }),
    examples: [
      "patchin microsoft email send --to you@example.com --subject \"Hello\" --body \"Hi\"",
    ],
  },
  {
    id: "microsoft.calendar.list",
    commandPath: ["microsoft", "calendar", "list"],
    description: "List upcoming Outlook calendar events.",
    provider: MICROSOFT_PROVIDER,
    options: [
      {
        key: "top",
        flags: "--top <n>",
        description: "Number of events to return",
        parser: parseNumber,
      },
    ],
    run: (args) => {
      const query: Record<string, string | number> = {};
      if (args.top) query["$top"] = args.top as number;
      return {
        provider: MICROSOFT_PROVIDER,
        path: "me/events",
        method: "GET",
        query,
      };
    },
    examples: ["patchin microsoft calendar list --top 10"],
  },
  {
    id: "microsoft.calendar.create",
    commandPath: ["microsoft", "calendar", "create"],
    description: "Create an Outlook calendar event.",
    provider: MICROSOFT_PROVIDER,
    options: [
      {
        key: "subject",
        flags: "--subject <text>",
        description: "Event subject",
        required: true,
      },
      {
        key: "start",
        flags: "--start <iso>",
        description: "Start time (ISO 8601)",
        required: true,
      },
      {
        key: "end",
        flags: "--end <iso>",
        description: "End time (ISO 8601)",
        required: true,
      },
      {
        key: "timeZone",
        flags: "--time-zone <tz>",
        description: "Time zone (e.g. UTC)",
      },
      {
        key: "body",
        flags: "--body <text>",
        description: "Event description",
      },
    ],
    run: (args) => ({
      provider: MICROSOFT_PROVIDER,
      path: "me/events",
      method: "POST",
      body: {
        subject: args.subject,
        body: {
          contentType: "Text",
          content: args.body,
        },
        start: {
          dateTime: args.start,
          timeZone: args.timeZone ?? "UTC",
        },
        end: {
          dateTime: args.end,
          timeZone: args.timeZone ?? "UTC",
        },
      },
    }),
    examples: [
      "patchin microsoft calendar create --subject \"Sync\" --start 2025-01-01T10:00:00Z --end 2025-01-01T10:30:00Z",
    ],
  },
  {
    id: "microsoft.drive.list",
    commandPath: ["microsoft", "drive", "list"],
    description: "List OneDrive root files.",
    provider: MICROSOFT_PROVIDER,
    options: [
      {
        key: "top",
        flags: "--top <n>",
        description: "Number of files to return",
        parser: parseNumber,
      },
    ],
    run: (args) => {
      const query: Record<string, string | number> = {};
      if (args.top) query["$top"] = args.top as number;

      return {
        provider: MICROSOFT_PROVIDER,
        path: "me/drive/root/children",
        method: "GET",
        query,
      };
    },
    examples: ["patchin microsoft drive list --top 20"],
  },
];
