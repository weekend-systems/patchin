import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <main className="flex flex-col items-center gap-8 max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Patchin
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          Plaid for MCPs. One login. All your data. Every agent.
        </p>

        <div className="flex flex-col gap-4 mt-8 w-full max-w-xs">
          <Link
            href="/login"
            className="flex h-12 items-center justify-center rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="flex h-12 items-center justify-center rounded-lg border border-zinc-300 font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900 transition-colors"
          >
            Sign up
          </Link>
        </div>

        <div className="mt-16 grid gap-6 text-left w-full">
          <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-white">Connect once</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              OAuth all your accounts through Patchin
            </p>
          </div>
          <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-white">Use anywhere</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Any agent, any machine, same access
            </p>
          </div>
          <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-zinc-900 dark:text-white">Full coverage</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              If it has an API, we can make it an MCP
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
