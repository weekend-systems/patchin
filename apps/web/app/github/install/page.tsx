"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { SiGithub } from "react-icons/si";

type Installation = {
  id: string;
  installationId: number;
  accountLogin: string;
  accountType: string;
  repositorySelection: string;
  createdAt: string;
};

export default function GitHubInstallPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      fetchInstallations();
    }
  }, [session]);

  async function fetchInstallations() {
    setLoading(true);
    try {
      const res = await fetch("/api/github/installations");
      if (res.ok) {
        const data = await res.json();
        setInstallations(data.installations || []);
      }
    } catch (err) {
      console.error("Failed to fetch installations:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleInstall() {
    window.location.href = "https://github.com/apps/patchin-sh/installations/new";
  }

  function handleContinue() {
    router.push("/dashboard?connected=github");
  }

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-3 mb-6">
          <SiGithub className="w-8 h-8 text-zinc-900 dark:text-white" />
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Install GitHub App
          </h1>
        </div>

        <p className="text-center text-zinc-600 dark:text-zinc-400 mb-8">
          Install the Patchin GitHub App to allow access to your repositories.
          This enables creating pull requests and accessing repository contents.
        </p>

        {loading ? (
          <div className="text-center text-zinc-500 py-8">
            Loading installations...
          </div>
        ) : installations.length === 0 ? (
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 mb-6">
            <p className="text-center text-zinc-600 dark:text-zinc-400 mb-4">
              No installations found. Install the app to grant repository access.
            </p>
            <button
              onClick={handleInstall}
              className="w-full h-12 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
            >
              Install GitHub App
            </button>
          </div>
        ) : (
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg mb-6">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="font-medium text-zinc-900 dark:text-white">
                Installed Accounts
              </h2>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {installations.map((installation) => (
                <div
                  key={installation.id}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">
                      {installation.accountLogin}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {installation.accountType} &middot;{" "}
                      {installation.repositorySelection === "all"
                        ? "All repositories"
                        : "Selected repositories"}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                    Installed
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={handleInstall}
                className="w-full h-10 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                + Add another account
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleContinue}
          className={`w-full h-12 rounded-lg font-medium transition-colors ${
            installations.length > 0
              ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              : "border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          {installations.length > 0 ? "Continue to Dashboard" : "Skip for now"}
        </button>
      </div>
    </div>
  );
}
