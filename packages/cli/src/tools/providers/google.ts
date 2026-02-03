import type { ToolDefinition } from "../types.js";
import { buildEmailRaw, parseNumber } from "../utils.js";

const GOOGLE_PROVIDER = "google";

export const googleTools: ToolDefinition[] = [
  {
    id: "google.email.list",
    commandPath: ["google", "email", "list"],
    description: "List Gmail messages for the authenticated user.",
    provider: GOOGLE_PROVIDER,
    options: [
      {
        key: "q",
        flags: "--q <query>",
        description: "Gmail search query (e.g. from:someone subject:\"hello\")",
      },
      {
        key: "maxResults",
        flags: "--max-results <n>",
        description: "Maximum number of messages to return",
        parser: parseNumber,
      },
      {
        key: "label",
        flags: "--label <labelId>",
        description: "Filter by label ID (repeatable)",
        collect: true,
      },
      {
        key: "includeSpamTrash",
        flags: "--include-spam-trash",
        description: "Include spam and trash in results",
        defaultValue: false,
      },
    ],
    run: (args) => {
      const query: Record<string, string | number | boolean | string[]> = {};
      if (args.q) query.q = args.q as string;
      if (args.maxResults) query.maxResults = args.maxResults as number;
      if (args.label) query.labelIds = args.label as string[];
      if (args.includeSpamTrash) query.includeSpamTrash = true;

      return {
        provider: GOOGLE_PROVIDER,
        path: "gmail/v1/users/me/messages",
        method: "GET",
        query,
      };
    },
    examples: [
      "patchin google email list --max-results 10",
      "patchin google email list --q \"from:boss\" --label INBOX",
    ],
  },
  {
    id: "google.email.send",
    commandPath: ["google", "email", "send"],
    description: "Send a plain-text Gmail message.",
    provider: GOOGLE_PROVIDER,
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
      {
        key: "from",
        flags: "--from <email>",
        description: "Override From header",
      },
      {
        key: "threadId",
        flags: "--thread-id <id>",
        description: "Gmail thread ID to reply in",
      },
    ],
    run: (args) => {
      const raw = buildEmailRaw({
        to: args.to as string[],
        subject: args.subject as string,
        body: args.body as string,
        cc: args.cc as string[] | undefined,
        bcc: args.bcc as string[] | undefined,
        from: args.from as string | undefined,
      });

      const body: Record<string, unknown> = { raw };
      if (args.threadId) {
        body.threadId = args.threadId;
      }

      return {
        provider: GOOGLE_PROVIDER,
        path: "gmail/v1/users/me/messages/send",
        method: "POST",
        body,
      };
    },
    examples: [
      "patchin google email send --to you@example.com --subject \"Hello\" --body \"Hi there\"",
    ],
  },
  {
    id: "google.calendar.list",
    commandPath: ["google", "calendar", "list"],
    description: "List upcoming events from the primary Google Calendar.",
    provider: GOOGLE_PROVIDER,
    options: [
      {
        key: "timeMin",
        flags: "--time-min <iso>",
        description: "Lower bound (ISO 8601)",
      },
      {
        key: "timeMax",
        flags: "--time-max <iso>",
        description: "Upper bound (ISO 8601)",
      },
      {
        key: "maxResults",
        flags: "--max-results <n>",
        description: "Maximum number of events to return",
        parser: parseNumber,
      },
      {
        key: "singleEvents",
        flags: "--single-events",
        description: "Expand recurring events into instances",
        defaultValue: false,
      },
      {
        key: "orderBy",
        flags: "--order-by <value>",
        description: "Order by (startTime or updated)",
      },
    ],
    run: (args) => {
      const query: Record<string, string | number | boolean> = {};
      if (args.timeMin) query.timeMin = args.timeMin as string;
      if (args.timeMax) query.timeMax = args.timeMax as string;
      if (args.maxResults) query.maxResults = args.maxResults as number;
      if (args.singleEvents) query.singleEvents = true;
      if (args.orderBy) query.orderBy = args.orderBy as string;

      return {
        provider: GOOGLE_PROVIDER,
        path: "calendar/v3/calendars/primary/events",
        method: "GET",
        query,
      };
    },
    examples: [
      "patchin google calendar list --max-results 5 --single-events",
    ],
  },
  {
    id: "google.calendar.create",
    commandPath: ["google", "calendar", "create"],
    description: "Create an event on the primary Google Calendar.",
    provider: GOOGLE_PROVIDER,
    options: [
      {
        key: "summary",
        flags: "--summary <text>",
        description: "Event summary",
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
        key: "description",
        flags: "--description <text>",
        description: "Event description",
      },
      {
        key: "timeZone",
        flags: "--time-zone <tz>",
        description: "Time zone (e.g. America/Los_Angeles)",
      },
    ],
    run: (args) => {
      const body: Record<string, unknown> = {
        summary: args.summary,
        description: args.description,
        start: {
          dateTime: args.start,
          timeZone: args.timeZone,
        },
        end: {
          dateTime: args.end,
          timeZone: args.timeZone,
        },
      };

      return {
        provider: GOOGLE_PROVIDER,
        path: "calendar/v3/calendars/primary/events",
        method: "POST",
        body,
      };
    },
    examples: [
      "patchin google calendar create --summary \"Demo\" --start 2025-01-01T10:00:00Z --end 2025-01-01T10:30:00Z",
    ],
  },
  {
    id: "google.drive.list",
    commandPath: ["google", "drive", "list"],
    description: "List files from Google Drive.",
    provider: GOOGLE_PROVIDER,
    options: [
      {
        key: "pageSize",
        flags: "--page-size <n>",
        description: "Maximum number of files",
        parser: parseNumber,
      },
      {
        key: "fields",
        flags: "--fields <fields>",
        description: "Fields to return",
      },
    ],
    run: (args) => {
      const query: Record<string, string | number> = {};
      if (args.pageSize) query.pageSize = args.pageSize as number;
      if (args.fields) query.fields = args.fields as string;

      return {
        provider: GOOGLE_PROVIDER,
        path: "drive/v3/files",
        method: "GET",
        query,
      };
    },
    examples: ["patchin google drive list --page-size 20"],
  },
  {
    id: "google.drive.search",
    commandPath: ["google", "drive", "search"],
    description: "Search files in Google Drive.",
    provider: GOOGLE_PROVIDER,
    options: [
      {
        key: "q",
        flags: "--q <query>",
        description: "Drive query (e.g. name contains 'report')",
        required: true,
      },
      {
        key: "pageSize",
        flags: "--page-size <n>",
        description: "Maximum number of files",
        parser: parseNumber,
      },
    ],
    run: (args) => {
      const query: Record<string, string | number> = {
        q: args.q as string,
      };
      if (args.pageSize) query.pageSize = args.pageSize as number;

      return {
        provider: GOOGLE_PROVIDER,
        path: "drive/v3/files",
        method: "GET",
        query,
      };
    },
    examples: ["patchin google drive search --q \"name contains 'report'\""],
  },
];
