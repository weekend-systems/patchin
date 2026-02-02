"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

type ConnectedAccount = {
  id: string;
  provider: string;
  providerEmail: string | null;
  createdAt: string;
};

type ApiKey = {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
};

const PROVIDERS = [
  { id: "google", name: "Google", description: "Gmail, Calendar, Drive" },
  { id: "microsoft", name: "Microsoft", description: "Outlook, OneDrive" },
  { id: "spotify", name: "Spotify", description: "Playlists, playback" },
];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const connected = searchParams.get("connected");
  const error = searchParams.get("error");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  async function fetchData() {
    setLoading(true);
    try {
      const [accountsRes, keysRes] = await Promise.all([
        fetch("/api/accounts"),
        fetch("/api/keys"),
      ]);
      if (accountsRes.ok) {
        const data = await accountsRes.json();
        setAccounts(data.accounts || []);
      }
      if (keysRes.ok) {
        const data = await keysRes.json();
        setApiKeys(data.keys || []);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function createApiKey() {
    if (!newKeyName.trim()) return;

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });
      if (res.ok) {
        const data = await res.json();
        setNewKey(data.key);
        setNewKeyName("");
        fetchData();
      }
    } catch (err) {
      console.error("Failed to create API key:", err);
    }
  }

  async function deleteApiKey(id: string) {
    try {
      const res = await fetch(`/api/keys?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to delete API key:", err);
    }
  }

  async function disconnectAccount(id: string) {
    try {
      const res = await fetch(`/api/accounts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to disconnect account:", err);
    }
  }

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-zinc-600 dark:text-zinc-400">
              {session.user.email}
            </span>
            <button
              onClick={() => signOut().then(() => router.push("/"))}
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              Sign out
            </button>
          </div>
        </header>

        {connected && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg">
            Successfully connected {connected}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
            Error: {error}
          </div>
        )}

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Connected Accounts
          </h2>
          <div className="grid gap-4">
            {PROVIDERS.map((provider) => {
              const connectedAccount = accounts.find((a) => a.provider === provider.id);
              return (
                <div
                  key={provider.id}
                  className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-zinc-900 dark:text-white">
                      {provider.name}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      {connectedAccount
                        ? connectedAccount.providerEmail || "Connected"
                        : provider.description}
                    </p>
                  </div>
                  {connectedAccount ? (
                    <button
                      onClick={() => disconnectAccount(connectedAccount.id)}
                      className="px-4 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <a
                      href={`/api/connect/${provider.id}`}
                      className="px-4 py-2 text-sm bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                      Connect
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            API Keys
          </h2>

          {newKey && (
            <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                Save this key now - it won't be shown again:
              </p>
              <code className="block p-2 bg-yellow-200 dark:bg-yellow-900 rounded text-sm font-mono break-all">
                {newKey}
              </code>
              <button
                onClick={() => setNewKey(null)}
                className="mt-2 text-sm text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
              >
                I've saved it
              </button>
            </div>
          )}

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key name (e.g., 'MCP Server')"
              className="flex-1 h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            />
            <button
              onClick={createApiKey}
              disabled={!newKeyName.trim()}
              className="px-4 h-10 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50"
            >
              Create Key
            </button>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            {loading ? (
              <div className="p-4 text-zinc-500">Loading...</div>
            ) : apiKeys.length === 0 ? (
              <div className="p-4 text-zinc-500">No API keys yet</div>
            ) : (
              apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {key.name}
                    </p>
                    <p className="text-sm text-zinc-500 font-mono">
                      {key.keyPrefix}...
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-500">
                      {key.lastUsedAt
                        ? `Last used ${new Date(key.lastUsedAt).toLocaleDateString()}`
                        : "Never used"}
                    </span>
                    <button
                      onClick={() => deleteApiKey(key.id)}
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-12 p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Using the API
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Make requests to your connected services through the Patchin proxy:
          </p>
          <pre className="p-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-x-auto text-sm">
            <code>{`# Gmail example
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://patchin.sh/api/v1/google/gmail/v1/users/me/messages

# Outlook example
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://patchin.sh/api/v1/microsoft/v1.0/me/messages

# Spotify example
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://patchin.sh/api/v1/spotify/v1/me/playlists`}</code>
          </pre>
        </section>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-zinc-500">Loading...</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
