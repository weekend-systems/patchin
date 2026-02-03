# Patchin Skill

Use the Patchin CLI to access user's connected services with minimal tokens.

**Supported providers (raw URL mode):** Google, Microsoft, GitHub, Slack, Notion, Linear, YouTube, Strava, Spotify

## Installation

```bash
npm install -g @patchin/cli
```

## Setup

If not already authenticated, run:

```bash
patchin login
```

This outputs a verification URL. Tell the user to open it in their browser to complete authentication. Poll continues automatically until complete.

## Commands

### Check Status

```bash
patchin status
```

Returns: `{"authenticated":true,"base_url":"https://patchin.sh"}`

### List Connected Accounts

```bash
patchin accounts
```

Returns: `{"accounts":[{"id":"abc123","provider":"google","providerEmail":"user@gmail.com","isDefault":true},...]}`

### Built-in Tools

List the built-in tools:

```bash
patchin tools
```

Use built-in tools for common actions (the list below is a subset):

```bash
patchin google email list --max-results 10
patchin google email send --to you@example.com --subject "Hello" --body "Hi there"
patchin google calendar list --max-results 5 --single-events
patchin google drive search --q "name contains 'report'"
patchin microsoft email list --top 10
patchin microsoft calendar create --subject "Sync" --start 2025-01-01T10:00:00Z --end 2025-01-01T10:30:00Z
patchin slack message send --channel C123456 --text "Hello"
patchin notion search --query "meeting notes"
patchin linear issues list --limit 5
patchin github issues list --owner org --repo project --state open
patchin spotify playlist create --name "Focus" --no-public
patchin spotify playlist add --playlist PLAYLIST_ID --uris spotify:track:abc,spotify:track:def
patchin youtube search --q "coding tutorial" --max-results 5
patchin strava activities list --per-page 10
```

### Raw URL Requests

```bash
patchin url <url> [options]
```

`<url>` can be a full URL or a path relative to the base URL (e.g. `/api/v1/google/...`).

**Options:**
- `-X, --method <method>` - HTTP method (default: GET)
- `-d, --data <json>` - Request body
- `-q, --query <key=value>` - Query parameter (repeatable)
- `-H, --header <key: value>` - Custom header (repeatable)
- `-r, --raw` - Raw output (no JSON formatting)

## Examples

### Google (Raw URL Examples)

```bash
# Gmail - list messages
patchin url /api/v1/google/gmail/v1/users/me/messages

# Gmail - get specific message
patchin url /api/v1/google/gmail/v1/users/me/messages/MESSAGE_ID

# Gmail - send email
patchin url /api/v1/google/gmail/v1/users/me/messages/send -X POST -d '{"raw":"BASE64_EMAIL"}'

# Calendar - list events
patchin url /api/v1/google/calendar/v3/calendars/primary/events

# Calendar - list events with query params
patchin url /api/v1/google/calendar/v3/calendars/primary/events -q maxResults=10 -q timeMin=2024-01-01T00:00:00Z

# Drive - list files
patchin url /api/v1/google/drive/v3/files

# Drive - search files
patchin url /api/v1/google/drive/v3/files -q "q=name contains 'report'"
```

### Microsoft (Raw URL Examples)

```bash
# Outlook - list messages
patchin url /api/v1/microsoft/me/messages

# Outlook - get specific message
patchin url /api/v1/microsoft/me/messages/MESSAGE_ID

# Calendar - list events
patchin url /api/v1/microsoft/me/calendar/events

# OneDrive - list files
patchin url /api/v1/microsoft/me/drive/root/children

# User profile
patchin url /api/v1/microsoft/me
```

### Spotify (Raw URL Examples)

```bash
# Current user profile
patchin url /api/v1/spotify/v1/me

# User's playlists
patchin url /api/v1/spotify/v1/me/playlists

# Currently playing
patchin url /api/v1/spotify/v1/me/player/currently-playing

# Search
patchin url /api/v1/spotify/v1/search -q "q=artist:radiohead" -q type=track
```

### GitHub (Raw URL Examples)

```bash
# List user's repos
patchin url /api/v1/github/user/repos

# Get repo details
patchin url /api/v1/github/repos/OWNER/REPO

# List issues
patchin url /api/v1/github/repos/OWNER/REPO/issues

# Create issue
patchin url /api/v1/github/repos/OWNER/REPO/issues -X POST -d '{"title":"Bug","body":"Description"}'

# List PRs
patchin url /api/v1/github/repos/OWNER/REPO/pulls

# Get notifications
patchin url /api/v1/github/notifications
```

### Slack (Raw URL Examples)

```bash
# List channels
patchin url /api/v1/slack/conversations.list

# Get channel history
patchin url /api/v1/slack/conversations.history -q channel=CHANNEL_ID

# Send message
patchin url /api/v1/slack/chat.postMessage -X POST -d '{"channel":"CHANNEL_ID","text":"Hello"}'

# List users
patchin url /api/v1/slack/users.list
```

### Notion (Raw URL Examples)

```bash
# Search pages
patchin url /api/v1/notion/v1/search -X POST -d '{"query":"meeting notes"}'

# Get page
patchin url /api/v1/notion/v1/pages/PAGE_ID

# Get database
patchin url /api/v1/notion/v1/databases/DATABASE_ID

# Query database
patchin url /api/v1/notion/v1/databases/DATABASE_ID/query -X POST -d '{}'

# Get block children
patchin url /api/v1/notion/v1/blocks/BLOCK_ID/children
```

### Linear (Raw URL Examples)

```bash
# GraphQL API - list issues
patchin url /api/v1/linear/graphql -X POST -d '{"query":"{ issues { nodes { id title state { name } } } }"}'

# Get viewer info
patchin url /api/v1/linear/graphql -X POST -d '{"query":"{ viewer { id email } }"}'

# Create issue
patchin url /api/v1/linear/graphql -X POST -d '{"query":"mutation { issueCreate(input: {teamId: \"TEAM_ID\", title: \"Bug\"}) { issue { id } } }"}'
```

### YouTube (Raw URL Examples)

```bash
# List user's playlists
patchin url /api/v1/youtube/youtube/v3/playlists -q mine=true -q part=snippet

# List subscriptions
patchin url /api/v1/youtube/youtube/v3/subscriptions -q mine=true -q part=snippet

# Search videos
patchin url /api/v1/youtube/youtube/v3/search -q part=snippet -q "q=coding tutorial"
```

### Strava

```bash
# Get athlete profile
patchin strava athlete

# List activities
patchin strava athlete/activities

# Get activity details
patchin strava activities/ACTIVITY_ID

# Get activity streams (GPS, heart rate, etc.)
patchin strava activities/ACTIVITY_ID/streams -q keys=latlng,heartrate
```

## Error Handling

All errors are JSON on stderr:

```json
{"error":"not_authenticated","message":"Not logged in","hint":"Run: patchin login"}
{"error":"provider_not_connected","message":"No google account connected","hint":"Connect at patchin.sh/dashboard"}
{"error":"api_error","message":"Not Found (404)"}
```

## Tips

1. Always check `patchin status` first to verify authentication
2. Use `patchin accounts` to see which providers are connected
3. If a provider isn't connected, direct the user to https://patchin.sh/dashboard
4. All responses are JSON - parse them for structured data
5. Use `-q` for query parameters instead of building URLs manually
6. Users can connect multiple accounts per provider (e.g., two Google accounts)
7. Use `-a email@example.com` to target a specific account when multiple are connected
8. Without `-a`, the default account is used automatically
