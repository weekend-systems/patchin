# Patchin

**Plaid for MCPs.** One login. All your data. Every agent.

## The Problem

Setting up MCPs is painful. Every new agent, every new machine — you're back to wrangling OAuth credentials, configuring tokens, debugging auth flows. Multiply that by every service you use (Google, Notion, Slack, Linear...) and it's a mess.

You can access all your data via APIs. But making that data available to AI agents? That's still way too hard.

## The Solution

Patchin centralizes authentication and gives you MCP access to everything in one place.

1. **Connect once** — OAuth all your accounts through Patchin
2. **Use anywhere** — Any agent, any machine, same access
3. **Full coverage** — If it has an API, we can make it an MCP

We handle the auth. You get your data in every agent, instantly.

## Architecture

```
┌─────────────────┐      ┌─────────────────┐
│  patchin.sh     │      │  Google/Notion  │
│  (web UI)       │      │  APIs           │
│  - OAuth flows  │      │                 │
│  - token vault  │      │                 │
└────────┬────────┘      └────────▲────────┘
         │                        │
         │ tokens                 │ direct API calls
         ▼                        │
┌─────────────────────────────────┴──┐
│  patchin CLI / local MCP server    │
│  - runs on user's machine          │
│  - fetches tokens from patchin.sh  │
│  - serves MCP to Claude            │
└────────────────────────────────────┘
```

**Key principle:** We're a token broker, not a proxy. Your API calls go direct to Google/Notion/etc. We never see your data — just the auth handshake.

## User Flow

### For Agents (Device Authorization Flow)

The recommended way to authenticate agents and CLI tools:

```bash
# Agent initiates the flow
curl -X POST https://patchin.sh/api/auth/device

# Response:
# {
#   "device_code": "dc_Ej8kL2mN...",
#   "verification_url": "https://patchin.sh/setup/dc_Ej8kL2mN...",
#   "expires_in": 900,
#   "interval": 5
# }

# User opens the verification_url in browser:
# 1. Signs up or logs in
# 2. Connects their accounts (Google, Microsoft, etc.)
# 3. Clicks "Complete Setup"

# Agent polls for completion
curl -X POST https://patchin.sh/api/auth/device/token \
  -H "Content-Type: application/json" \
  -d '{"device_code": "dc_Ej8kL2mN..."}'

# Once complete, response includes:
# { "status": "completed", "api_key": "pk_live_..." }
```

### For CLI Tools

```bash
# 1. Authenticate with Patchin
patchin login

# 2. Connect accounts via web UI (OAuth)
# -> patchin.sh/connect

# 3. Run local MCP server
patchin serve

# 4. Point Claude at localhost
# -> Add to your MCP config
```

## Device Authorization API

For agents and tools that need to authenticate users without handling browser redirects:

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/device` | POST | None | Initiate device flow, get device code |
| `/api/auth/device/status` | GET | None | Check if code is valid/expired |
| `/api/auth/device/token` | POST | None | Poll for API key (after user completes) |
| `/api/auth/device/claim` | POST | Session | Associate device with user |
| `/api/auth/device/complete` | POST | Session | Complete setup, generate API key |

The flow follows the [OAuth 2.0 Device Authorization Grant](https://datatracker.ietf.org/doc/html/rfc8628) pattern.

## Why Open Source?

Trust. You're giving us OAuth access to your accounts. You should be able to see exactly what we do with your tokens.

Most people won't self-host (and that's fine — use the hosted version). But the code is here if you want to audit it or run your own.

## Pricing

| Tier | Price | What you get |
|------|-------|--------------|
| Personal | Free | 5-10 connected accounts |
| Pro | $10-20/mo | Unlimited accounts, team sharing, analytics |
| Teams | $X/seat | Audit logs, agent activity visibility, admin controls |

## Why This Will Matter

Right now it's developers with Claude Code hitting this pain. Soon it's everyone using AI agents.

Your data lives in dozens of services. Agents need access to that data to be useful. Patchin is the bridge — one login, and your entire digital life is available to any agent you use.

## Integrations

### Tier 1 — Launch
High demand, core productivity tools.

| Service | Scopes | Status |
|---------|--------|--------|
| Google Calendar | Read/write events | Planned |
| Gmail | Send, receive, manage | Planned |
| Google Drive | Files and folders | Planned |
| Google Docs | Create, read, edit | Planned |
| Google Sheets | Read/write data | Planned |
| Notion | Workspaces and pages | Planned |
| Linear | Issues, comments, projects | Planned |
| Slack | Messages, channels | Planned |
| GitHub | Repos, issues, PRs | Planned |

### Tier 2 — Fast Follows
Common in teams, frequent requests.

| Service | Scopes | Status |
|---------|--------|--------|
| Outlook | Email, calendar | Planned |
| OneDrive | Files and folders | Planned |
| Jira | Issues, projects | Planned |
| Asana | Tasks, projects | Planned |
| HubSpot | CRM, contacts, deals | Planned |
| Confluence | Spaces, content | Planned |

### Tier 3 — Nice to Have
Lower priority, add based on demand.

| Service | Scopes | Status |
|---------|--------|--------|
| Stripe | Payments, customers | Planned |
| Discord | Guilds, messages | Planned |
| Dropbox | Files, folders | Planned |
| Box | Files, folders | Planned |
| Todoist | Tasks, projects | Planned |
| Zendesk | Tickets, users | Planned |
| Twilio | SMS, voice | Planned |
| Spotify | Playlists, playback | Planned |

## Roadmap

### Phase 1: Core
- [ ] OAuth flow UI
- [ ] Token vault (encrypted storage, refresh handling)
- [ ] CLI for local MCP serving
- [ ] Tier 1 integrations (Google suite, Notion, Linear, Slack, GitHub)

### Phase 2: Scale
- [ ] Tier 2 integrations
- [ ] Team accounts
- [ ] Analytics: which agents are using what

### Phase 3: Enterprise
- [ ] Tier 3 integrations based on demand
- [ ] Audit logs
- [ ] SSO
- [ ] Compliance features

## Tech Stack

TBD — likely:
- **Frontend:** Next.js
- **Backend:** Node.js or Python
- **Auth:** Standard OAuth 2.0 flows
- **Storage:** Encrypted token vault (Postgres + encryption at rest)
- **MCP:** TypeScript MCP SDK

## Contributing

This is early. If you want to help build better MCPs than the official ones, open an issue or PR.

## License

AGPL-3.0 — See [LICENSE](./LICENSE)

If you run this as a service, you must open-source your modifications. This is intentional.

---

Built by [Jack Weatherilt](https://jackw.xyz)
