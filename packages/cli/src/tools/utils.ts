export function parseNumber(value: string): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Expected a number but received: ${value}`);
  }
  return parsed;
}

export function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

interface EmailPayload {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
  from?: string;
}

export function buildEmailRaw(payload: EmailPayload): string {
  const lines: string[] = [];
  if (payload.from) {
    lines.push(`From: ${payload.from}`);
  }
  lines.push(`To: ${payload.to.join(", ")}`);
  if (payload.cc && payload.cc.length > 0) {
    lines.push(`Cc: ${payload.cc.join(", ")}`);
  }
  if (payload.bcc && payload.bcc.length > 0) {
    lines.push(`Bcc: ${payload.bcc.join(", ")}`);
  }
  lines.push(`Subject: ${payload.subject}`);
  lines.push('Content-Type: text/plain; charset="UTF-8"');
  lines.push("MIME-Version: 1.0");
  lines.push("");
  lines.push(payload.body);

  const raw = Buffer.from(lines.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return raw;
}
