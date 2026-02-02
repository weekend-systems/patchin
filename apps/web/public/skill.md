# Patchin Skill

Use the Patchin CLI to access user's connected services with minimal tokens.

**Supported providers:** Google, Microsoft, GitHub, Slack, Notion, Linear, YouTube, Strava, Spotify

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

### Make API Requests

```bash
patchin <provider> <path> [options]
```

**Providers:** `google`, `microsoft`, `github`, `slack`, `notion`, `linear`, `youtube`, `strava`, `spotify`

**Options:**
- `-X, --method <method>` - HTTP method (default: GET)
- `-d, --data <json>` - Request body
- `-q, --query <key=value>` - Query parameter (repeatable)
- `-H, --header <key: value>` - Custom header (repeatable)
- `-a, --account <email|id>` - Use specific account (for multi-account)
- `-r, --raw` - Raw output (no JSON formatting)

## Examples

### Google

```bash
# Gmail - list messages
patchin google gmail/v1/users/me/messages

# Gmail - get specific message
patchin google gmail/v1/users/me/messages/MESSAGE_ID

# Gmail - send email
patchin google gmail/v1/users/me/messages/send -X POST -d '{"raw":"BASE64_EMAIL"}'

# Calendar - list events
patchin google calendar/v3/calendars/primary/events

# Calendar - list events with query params
patchin google calendar/v3/calendars/primary/events -q maxResults=10 -q timeMin=2024-01-01T00:00:00Z

# Drive - list files
patchin google drive/v3/files

# Drive - search files
patchin google drive/v3/files -q "q=name contains 'report'"
```

### Microsoft

```bash
# Outlook - list messages
patchin microsoft me/messages

# Outlook - get specific message
patchin microsoft me/messages/MESSAGE_ID

# Calendar - list events
patchin microsoft me/calendar/events

# OneDrive - list files
patchin microsoft me/drive/root/children

# User profile
patchin microsoft me
```

### Spotify

```bash
# Current user profile
patchin spotify v1/me

# User's playlists
patchin spotify v1/me/playlists

# Currently playing
patchin spotify v1/me/player/currently-playing

# Search
patchin spotify v1/search -q "q=artist:radiohead" -q type=track
```

### GitHub

```bash
# List user's repos
patchin github user/repos

# Get repo details
patchin github repos/OWNER/REPO

# List issues
patchin github repos/OWNER/REPO/issues

# Create issue
patchin github repos/OWNER/REPO/issues -X POST -d '{"title":"Bug","body":"Description"}'

# List PRs
patchin github repos/OWNER/REPO/pulls

# Get notifications
patchin github notifications
```

### Slack

```bash
# List channels
patchin slack conversations.list

# Get channel history
patchin slack conversations.history -q channel=CHANNEL_ID

# Send message
patchin slack chat.postMessage -X POST -d '{"channel":"CHANNEL_ID","text":"Hello"}'

# List users
patchin slack users.list
```

### Notion

```bash
# Search pages
patchin notion v1/search -X POST -d '{"query":"meeting notes"}'

# Get page
patchin notion v1/pages/PAGE_ID

# Get database
patchin notion v1/databases/DATABASE_ID

# Query database
patchin notion v1/databases/DATABASE_ID/query -X POST -d '{}'

# Get block children
patchin notion v1/blocks/BLOCK_ID/children
```

### Linear

```bash
# GraphQL API - list issues
patchin linear graphql -X POST -d '{"query":"{ issues { nodes { id title state { name } } } }"}'

# Get viewer info
patchin linear graphql -X POST -d '{"query":"{ viewer { id email } }"}'

# Create issue
patchin linear graphql -X POST -d '{"query":"mutation { issueCreate(input: {teamId: \"TEAM_ID\", title: \"Bug\"}) { issue { id } } }"}'
```

### YouTube

```bash
# List user's playlists
patchin youtube youtube/v3/playlists -q mine=true -q part=snippet

# List subscriptions
patchin youtube youtube/v3/subscriptions -q mine=true -q part=snippet

# Search videos
patchin youtube youtube/v3/search -q part=snippet -q "q=coding tutorial"
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
