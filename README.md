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

### Install the CLI

```bash
npm install -g @patchin/cli
```

### CLI Usage

```bash
# Authenticate (opens browser for OAuth)
patchin login
# {"status":"awaiting_authorization","verification_url":"https://patchin.sh/setup/..."}
# ... user completes setup in browser ...
# {"status":"authenticated"}

# Check status
patchin status
# {"authenticated":true,"base_url":"https://patchin.sh"}

# List connected accounts
patchin accounts
# {"accounts":[{"provider":"google","providerEmail":"you@gmail.com"}]}

# Make API requests (60-70% fewer tokens than curl!)
patchin google gmail/v1/users/me/messages
patchin google calendar/v3/calendars/primary/events -q maxResults=10
patchin microsoft me/messages -X POST -d '{"subject":"Hello"}'
```

### Why the CLI?

The CLI is optimized for AI agents. Compare:

| Operation | CLI | curl |
|-----------|-----|------|
| List Gmail | `patchin google gmail/v1/users/me/messages` | `curl -H "Authorization: Bearer pk_..." https://patchin.sh/api/v1/google/gmail/v1/users/me/messages` |
| **Tokens** | **~5** | **~18+** |

That's a 60-70% reduction in tokens for every API call.

### Claude Code Skill

Add the Patchin skill to your Claude Code configuration:

```json
{
  "skills": ["https://patchin.sh/skill.md"]
}
```

This teaches Claude how to use the Patchin CLI to access your connected services.

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

| Service | What you get | Status |
|---------|--------------|--------|
| Google | Gmail, Calendar, Drive | Live |
| Microsoft | Outlook, OneDrive | Live |
| GitHub | Repos, issues, PRs, gists | Live |
| Slack | Messages, channels | Live |
| Notion | Pages, databases | Live |
| Linear | Issues, projects | Live |
| YouTube | Playlists, subscriptions | Live |
| Strava | Activities, stats | Live |
| Spotify | Playlists, playback | Live |

**Coming soon:** Jira, Asana, HubSpot, Discord, Dropbox, Todoist

## Roadmap

### Phase 1: Core
- [x] OAuth flow UI
- [x] Token vault (encrypted storage, refresh handling)
- [x] CLI for API access
- [x] Core integrations (Google, Microsoft, GitHub, Slack, Notion, Linear, Spotify, Strava, YouTube)
- [x] Multi-account support per provider
- [x] Device authorization flow for agents

### Phase 2: Scale
- [ ] More integrations based on demand
- [ ] Team accounts
- [ ] Analytics: which agents are using what

### Phase 3: Enterprise
- [ ] Audit logs
- [ ] SSO
- [ ] Compliance features

## Tech Stack

- **Frontend:** Next.js 16 (App Router)
- **Backend:** Next.js API routes
- **Auth:** Better Auth + standard OAuth 2.0 flows
- **Database:** PostgreSQL with Drizzle ORM
- **Encryption:** AES-256-GCM for token storage
- **Hosting:** Fly.io

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Yarn 4

### Setup

```bash
# Install dependencies
yarn install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your values

# Run database migrations
cd packages/db && npx drizzle-kit push

# Start development server
yarn dev
```

### Environment Variables

**Required:**

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/patchin

# Auth
BETTER_AUTH_SECRET=random-32-char-string
BETTER_AUTH_URL=http://localhost:3000

# Token encryption (32 bytes hex = 64 chars)
TOKEN_ENCRYPTION_KEY=your-64-char-hex-string
```

**OAuth Providers** (add as needed):

```bash
# Google (also used for YouTube)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# Microsoft
MICROSOFT_CLIENT_ID=xxx
MICROSOFT_CLIENT_SECRET=xxx

# GitHub
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx

# Slack
SLACK_CLIENT_ID=xxx
SLACK_CLIENT_SECRET=xxx

# Notion
NOTION_CLIENT_ID=xxx
NOTION_CLIENT_SECRET=xxx

# Linear
LINEAR_CLIENT_ID=xxx
LINEAR_CLIENT_SECRET=xxx

# Strava
STRAVA_CLIENT_ID=xxx
STRAVA_CLIENT_SECRET=xxx

# Spotify
SPOTIFY_CLIENT_ID=xxx
SPOTIFY_CLIENT_SECRET=xxx
```

### OAuth Callback URLs

When setting up OAuth apps, use these callback URLs:

| Provider | Callback URL |
|----------|-------------|
| Google | `http://localhost:3000/api/connect/google/callback` |
| Microsoft | `http://localhost:3000/api/connect/microsoft/callback` |
| GitHub | `http://localhost:3000/api/connect/github/callback` |
| Slack | `http://localhost:3000/api/connect/slack/callback` |
| Notion | `http://localhost:3000/api/connect/notion/callback` |
| Linear | `http://localhost:3000/api/connect/linear/callback` |
| YouTube | `http://localhost:3000/api/connect/youtube/callback` |
| Strava | `http://localhost:3000/api/connect/strava/callback` |
| Spotify | `http://localhost:3000/api/connect/spotify/callback` |

## Contributing

This is early. If you want to help build better MCPs than the official ones, open an issue or PR.

## License

AGPL-3.0 — See [LICENSE](./LICENSE)

If you run this as a service, you must open-source your modifications. This is intentional.

---

Built by [Jack Weatherilt](https://jackw.xyz)
