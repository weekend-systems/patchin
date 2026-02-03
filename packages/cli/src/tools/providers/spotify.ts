import type { ToolDefinition } from "../types.js";
import { parseCommaList, parseNumber } from "../utils.js";

const SPOTIFY_PROVIDER = "spotify";

export const spotifyTools: ToolDefinition[] = [
  {
    id: "spotify.playlist.create",
    commandPath: ["spotify", "playlist", "create"],
    description: "Create a Spotify playlist for the current user.",
    provider: SPOTIFY_PROVIDER,
    options: [
      {
        key: "name",
        flags: "--name <name>",
        description: "Playlist name",
        required: true,
      },
      {
        key: "description",
        flags: "--description <text>",
        description: "Playlist description",
      },
      {
        key: "public",
        flags: "--no-public",
        description: "Make playlist private",
        defaultValue: true,
      },
      {
        key: "collaborative",
        flags: "--collaborative",
        description: "Make playlist collaborative",
        defaultValue: false,
      },
      {
        key: "user",
        flags: "--user <id>",
        description: "Spotify user ID (defaults to current user)",
      },
    ],
    run: async (args, ctx) => {
      let userId = args.user as string | undefined;
      if (!userId) {
        const profile = await ctx.fetchProviderJson(
          SPOTIFY_PROVIDER,
          "v1/me"
        );
        const id = (profile as { id?: string }).id;
        if (!id) {
          throw new Error("Could not resolve Spotify user ID");
        }
        userId = id;
      }

      const body = {
        name: args.name,
        description: args.description,
        public: args.public ?? true,
        collaborative: args.collaborative ?? false,
      };

      return {
        provider: SPOTIFY_PROVIDER,
        path: `v1/users/${userId}/playlists`,
        method: "POST",
        body,
      };
    },
    examples: [
      "patchin spotify playlist create --name \"Focus\" --no-public",
    ],
  },
  {
    id: "spotify.playlist.add",
    commandPath: ["spotify", "playlist", "add"],
    description: "Add tracks to a Spotify playlist.",
    provider: SPOTIFY_PROVIDER,
    options: [
      {
        key: "playlist",
        flags: "--playlist <id>",
        description: "Spotify playlist ID",
        required: true,
      },
      {
        key: "uris",
        flags: "--uris <uri1,uri2>",
        description: "Comma-separated track URIs",
        required: true,
        parser: parseCommaList,
      },
      {
        key: "position",
        flags: "--position <n>",
        description: "Insert position (0-based)",
        parser: parseNumber,
      },
    ],
    run: (args) => {
      const body: Record<string, unknown> = {
        uris: args.uris,
      };
      if (args.position !== undefined) {
        body.position = args.position;
      }

      return {
        provider: SPOTIFY_PROVIDER,
        path: `v1/playlists/${args.playlist}/tracks`,
        method: "POST",
        body,
      };
    },
    examples: [
      "patchin spotify playlist add --playlist PLAYLIST_ID --uris spotify:track:abc,spotify:track:def",
    ],
  },
  {
    id: "spotify.playlists.list",
    commandPath: ["spotify", "playlists", "list"],
    description: "List playlists for the current user.",
    provider: SPOTIFY_PROVIDER,
    options: [
      {
        key: "limit",
        flags: "--limit <n>",
        description: "Maximum number of playlists",
        parser: parseNumber,
      },
    ],
    run: (args) => {
      const query: Record<string, number> = {};
      if (args.limit) query.limit = args.limit as number;

      return {
        provider: SPOTIFY_PROVIDER,
        path: "v1/me/playlists",
        method: "GET",
        query,
      };
    },
    examples: ["patchin spotify playlists list --limit 10"],
  },
  {
    id: "spotify.player.status",
    commandPath: ["spotify", "player", "status"],
    description: "Get the current Spotify playback status.",
    provider: SPOTIFY_PROVIDER,
    run: () => ({
      provider: SPOTIFY_PROVIDER,
      path: "v1/me/player",
      method: "GET",
    }),
    examples: ["patchin spotify player status"],
  },
];
