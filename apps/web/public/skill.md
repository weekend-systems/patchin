# Patchin Skill

Use the Patchin CLI to access user's connected services (Google, Microsoft, Spotify, etc.) with minimal tokens.

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

Returns: `{"accounts":[{"provider":"google","providerEmail":"user@gmail.com"},...]}`

### Make API Requests

```bash
patchin <provider> <path> [options]
```

**Providers:** `google`, `microsoft`, `spotify`

**Options:**
- `-X, --method <method>` - HTTP method (default: GET)
- `-d, --data <json>` - Request body
- `-q, --query <key=value>` - Query parameter (repeatable)
- `-H, --header <key: value>` - Custom header (repeatable)
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
