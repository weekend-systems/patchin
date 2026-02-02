"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

type ConnectedAccount = {
  id: string;
  provider: string;
  providerEmail: string | null;
  createdAt: string;
};

type DeviceStatus = {
  valid: boolean;
  expired: boolean;
  claimed: boolean;
};

const PROVIDERS = [
  { id: "google", name: "Google", description: "Gmail, Calendar, Drive" },
  { id: "microsoft", name: "Microsoft", description: "Outlook, OneDrive" },
  { id: "spotify", name: "Spotify", description: "Playlists, playback" },
];

export default function SetupPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();

  const [step, setStep] = useState<"auth" | "connect" | "complete">("auth");
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connected = searchParams.get("connected");

  // Check device code validity
  useEffect(() => {
    async function checkDeviceCode() {
      try {
        const res = await fetch(`/api/auth/device/status?code=${code}`);
        const data = await res.json();
        setDeviceStatus(data);

        if (!data.valid) {
          setError("Invalid device code");
        } else if (data.expired) {
          setError("This setup link has expired. Please start over from your terminal.");
        }
      } catch {
        setError("Failed to validate device code");
      } finally {
        setLoading(false);
      }
    }

    checkDeviceCode();
  }, [code]);

  // Determine step based on session state
  useEffect(() => {
    if (isPending || loading) return;

    if (!session) {
      setStep("auth");
    } else {
      setStep("connect");
    }
  }, [session, isPending, loading]);

  // Fetch accounts and claim device when authenticated
  const fetchAccountsAndClaim = useCallback(async () => {
    if (!session) return;

    try {
      // Claim the device code for this user
      await fetch("/api/auth/device/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_code: code }),
      });

      // Fetch connected accounts
      const res = await fetch("/api/accounts");
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
      }
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    }
  }, [session, code]);

  useEffect(() => {
    if (session && step === "connect") {
      fetchAccountsAndClaim();
    }
  }, [session, step, fetchAccountsAndClaim]);

  // Refetch accounts when a provider was just connected
  useEffect(() => {
    if (connected && session) {
      fetchAccountsAndClaim();
    }
  }, [connected, session, fetchAccountsAndClaim]);

  async function handleComplete() {
    setCompleting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/device/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_code: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to complete setup");
        return;
      }

      setCompleted(true);
      setStep("complete");
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setCompleting(false);
    }
  }

  const currentPath = `/setup/${code}`;
  const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
  const signupUrl = `/signup?redirect=${encodeURIComponent(currentPath)}`;

  if (loading || isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (error && !deviceStatus?.valid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Return to your terminal and run the setup command again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-zinc-900 dark:text-white">
          {completed ? "Setup Complete" : "Agent Setup"}
        </h1>
        <p className="text-center text-zinc-500 mb-8">
          {completed
            ? "You can now return to your terminal."
            : "Connect your accounts to give your agent access."}
        </p>

        {connected && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg text-center">
            Successfully connected {connected}
          </div>
        )}

        {error && deviceStatus?.valid && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <StepIndicator
            number={1}
            label="Sign in"
            active={step === "auth"}
            completed={step !== "auth"}
          />
          <div className="w-8 h-px bg-zinc-300 dark:bg-zinc-700" />
          <StepIndicator
            number={2}
            label="Connect"
            active={step === "connect"}
            completed={step === "complete"}
          />
          <div className="w-8 h-px bg-zinc-300 dark:bg-zinc-700" />
          <StepIndicator
            number={3}
            label="Done"
            active={step === "complete"}
            completed={false}
          />
        </div>

        {/* Step 1: Authentication */}
        {step === "auth" && (
          <div className="flex flex-col gap-4">
            <Link
              href={loginUrl}
              className="h-12 flex items-center justify-center rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
            >
              Log in
            </Link>
            <Link
              href={signupUrl}
              className="h-12 flex items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Create account
            </Link>
          </div>
        )}

        {/* Step 2: Connect accounts */}
        {step === "connect" && (
          <div className="flex flex-col gap-4">
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
              {PROVIDERS.map((provider) => {
                const connectedAccount = accounts.find(
                  (a) => a.provider === provider.id
                );
                return (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between p-4"
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
                      <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Connected
                      </span>
                    ) : (
                      <a
                        href={`/api/connect/${provider.id}?redirect=${encodeURIComponent(currentPath)}`}
                        className="px-4 py-2 text-sm bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                      >
                        Connect
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleComplete}
              disabled={accounts.length === 0 || completing}
              className="h-12 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {completing ? "Completing..." : "Complete Setup"}
            </button>

            {accounts.length === 0 && (
              <p className="text-sm text-zinc-500 text-center">
                Connect at least one account to continue.
              </p>
            )}
          </div>
        )}

        {/* Step 3: Complete */}
        {step === "complete" && (
          <div className="text-center">
            <div className="mb-6 p-6 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-green-800 dark:text-green-200">
                Your agent is now ready to use your connected accounts.
              </p>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              You can close this window and return to your terminal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StepIndicator({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          completed
            ? "bg-green-500 text-white"
            : active
              ? "bg-zinc-900 dark:bg-white text-white dark:text-black"
              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
        }`}
      >
        {completed ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          number
        )}
      </div>
      <span
        className={`text-xs ${
          active
            ? "text-zinc-900 dark:text-white font-medium"
            : "text-zinc-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
