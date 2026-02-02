import Link from "next/link";

export default function Home() {
  return (
    <div className="plaid-bg min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <div className="sheriff-badge" />
          <span className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight">
            Patchin
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link 
            href="/login" 
            className="font-[family-name:var(--font-heading)] text-sm font-medium uppercase tracking-wider hover:text-[var(--accent-rust)] transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/signup"
            className="font-[family-name:var(--font-heading)] text-sm font-medium uppercase tracking-wider px-4 py-2 border-2 border-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-secondary)] transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="px-8 py-24 md:py-32 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-[var(--accent-rust)]/30 mb-6">
                <div className="sheriff-badge w-3 h-3" />
                <span className="font-[family-name:var(--font-heading)] text-xs font-medium uppercase tracking-wider text-[var(--accent-rust)]">
                  Now in Open Beta
                </span>
              </div>
              <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
                Your data,{" "}
                <span className="text-[var(--accent-rust)]">everywhere</span>
              </h1>
              <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-lg">
                Connect all your accounts once. Give any AI agent instant access to your data — from Google Drive to Notion to Slack.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="btn-primary text-center">
                  Start Free
                </Link>
                <Link href="#how-it-works" className="btn-secondary text-center">
                  See How It Works
                </Link>
              </div>
              <div className="mt-8 p-4 border border-[var(--border-color)] bg-[var(--bg-tertiary)]">
                <p className="text-sm text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">Quick setup:</span>{" "}
                  Ask your AI to read{" "}
                  <code className="px-1.5 py-0.5 bg-[var(--bg-secondary)] text-[var(--accent-rust)] font-mono text-xs">
                    https://patchin.sh/skill.md
                  </code>{" "}
                  to get started
                </p>
              </div>
            </div>
            <div className="relative">
              {/* Visual representation of connected services */}
              <div className="card-sharp p-8 space-y-4">
                <div className="flex items-center gap-3 p-3 border border-[var(--border-color)]">
                  <div className="w-10 h-10 service-icon-google flex items-center justify-center text-white font-bold text-xs">G</div>
                  <div className="flex-1">
                    <div className="font-[family-name:var(--font-heading)] font-semibold text-sm">Google Workspace</div>
                    <div className="text-xs text-[var(--text-muted)]">Connected</div>
                  </div>
                  <div className="w-2 h-2 bg-[var(--accent-sage)]" />
                </div>
                <div className="flex items-center gap-3 p-3 border border-[var(--border-color)]">
                  <div className="w-10 h-10 service-icon-notion flex items-center justify-center text-white font-bold text-xs">N</div>
                  <div className="flex-1">
                    <div className="font-[family-name:var(--font-heading)] font-semibold text-sm">Notion</div>
                    <div className="text-xs text-[var(--text-muted)]">Connected</div>
                  </div>
                  <div className="w-2 h-2 bg-[var(--accent-sage)]" />
                </div>
                <div className="flex items-center gap-3 p-3 border border-[var(--border-color)]">
                  <div className="w-10 h-10 service-icon-linear flex items-center justify-center text-white font-bold text-xs">L</div>
                  <div className="flex-1">
                    <div className="font-[family-name:var(--font-heading)] font-semibold text-sm">Linear</div>
                    <div className="text-xs text-[var(--text-muted)]">Connected</div>
                  </div>
                  <div className="w-2 h-2 bg-[var(--accent-sage)]" />
                </div>
                <div className="flex items-center gap-3 p-3 border border-[var(--border-color)]">
                  <div className="w-10 h-10 service-icon-slack flex items-center justify-center text-white font-bold text-xs">S</div>
                  <div className="flex-1">
                    <div className="font-[family-name:var(--font-heading)] font-semibold text-sm">Slack</div>
                    <div className="text-xs text-[var(--text-muted)]">Connected</div>
                  </div>
                  <div className="w-2 h-2 bg-[var(--accent-sage)]" />
                </div>
                <div className="pt-4 border-t border-[var(--border-color)]">
                  <div className="text-xs font-[family-name:var(--font-heading)] uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    Available to agents via MCP
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-[var(--accent-rust)]/10 text-[var(--accent-rust)] text-xs font-medium">Claude</span>
                    <span className="px-2 py-1 bg-[var(--accent-sage)]/10 text-[var(--accent-sage)] text-xs font-medium">Cursor</span>
                    <span className="px-2 py-1 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] text-xs font-medium">+ more</span>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-[var(--accent-rust)]/20 -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 border-2 border-[var(--accent-sage)]/20 -z-10" />
            </div>
          </div>
        </section>

        <div className="divider-plaid mx-8" />

        {/* How It Works */}
        <section id="how-it-works" className="px-8 py-24 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Three simple steps to connect your entire digital workspace
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-sharp p-8">
              <div className="w-12 h-12 bg-[var(--accent-rust)] flex items-center justify-center text-white font-[family-name:var(--font-heading)] text-xl font-bold mb-6">
                1
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-3">
                Connect Once
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                OAuth all your accounts through Patchin. Google, Notion, Slack, Linear — all in one place.
              </p>
            </div>
            <div className="card-sharp p-8">
              <div className="w-12 h-12 bg-[var(--accent-sage)] flex items-center justify-center text-white font-[family-name:var(--font-heading)] text-xl font-bold mb-6">
                2
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-3">
                Use Anywhere
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Any agent, any machine, same access. Your credentials follow you, securely.
              </p>
            </div>
            <div className="card-sharp p-8">
              <div className="w-12 h-12 bg-[var(--accent-gold)] flex items-center justify-center text-white font-[family-name:var(--font-heading)] text-xl font-bold mb-6">
                3
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-3">
                Full Coverage
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                If it has an API, we can make it an MCP. Your entire digital life, available to any agent.
              </p>
            </div>
          </div>
        </section>

        <div className="divider-plaid mx-8" />

        {/* CLI Section */}
        <section className="px-8 py-24 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-4">
              Built for Agents
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              A token-efficient CLI designed for AI agents. 60-70% fewer tokens than raw API calls.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="card-sharp p-6 bg-[var(--bg-tertiary)]">
              <div className="font-mono text-sm space-y-4 text-[var(--text-secondary)]">
                <div>
                  <span className="text-[var(--text-muted)]"># Install (no dependencies required)</span>
                </div>
                <div className="break-all">
                  <span className="text-[var(--accent-sage)]">$</span> curl -fsSL https://patchin.sh/install.sh | bash
                </div>
                <div className="pt-2 text-xs text-[var(--text-muted)]">
                  # or with npm: npm install -g @patchin/cli
                </div>
                <div className="pt-4">
                  <span className="text-[var(--text-muted)]"># Login (user completes in browser)</span>
                </div>
                <div>
                  <span className="text-[var(--accent-sage)]">$</span> patchin login
                </div>
                <div className="pl-4 text-[var(--text-muted)]">
                  {`{"status":"awaiting_authorization","verification_url":"..."}`}
                </div>
                <div className="pl-4 text-[var(--text-muted)]">
                  {`{"status":"authenticated"}`}
                </div>
                <div className="pt-4">
                  <span className="text-[var(--text-muted)]"># Make API calls</span>
                </div>
                <div>
                  <span className="text-[var(--accent-sage)]">$</span> patchin google gmail/v1/users/me/messages
                </div>
                <div>
                  <span className="text-[var(--accent-sage)]">$</span> patchin microsoft me/calendar/events
                </div>
                <div>
                  <span className="text-[var(--accent-sage)]">$</span> patchin spotify v1/me/playlists
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-4">
                Why a CLI?
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Every token counts when you&apos;re running AI agents. The Patchin CLI is designed to minimize token usage while giving full API access.
              </p>
              <div className="card-sharp p-4 mb-6">
                <div className="text-xs font-[family-name:var(--font-heading)] uppercase tracking-wider text-[var(--text-muted)] mb-3">
                  Token Comparison
                </div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">CLI:</span>
                    <span className="text-[var(--accent-sage)]">~5 tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">curl:</span>
                    <span className="text-[var(--accent-rust)]">~18+ tokens</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-3 text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--accent-sage)]" />
                  All output is JSON for easy parsing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--accent-sage)]" />
                  Credentials stored securely in ~/.patchin
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--accent-sage)]" />
                  Works with any provider API endpoint
                </li>
              </ul>
            </div>
          </div>

        </section>

        <div className="divider-plaid mx-8" />

        {/* Security Badge Section */}
        <section className="px-8 py-24 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--accent-rust)] mb-6" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}>
            <span className="text-white text-2xl">★</span>
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-6">
            Security First
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto leading-relaxed">
            We&apos;re a token broker, not a proxy. Your API calls go direct to Google, Notion, and others. We never see your data — just the auth handshake. Open source and auditable.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-4 py-2 border border-[var(--border-color)] font-[family-name:var(--font-heading)] uppercase tracking-wider">
              End-to-End Encrypted
            </span>
            <span className="px-4 py-2 border border-[var(--border-color)] font-[family-name:var(--font-heading)] uppercase tracking-wider">
              Open Source
            </span>
            <span className="px-4 py-2 border border-[var(--border-color)] font-[family-name:var(--font-heading)] uppercase tracking-wider">
              Self-Hostable
            </span>
          </div>
        </section>

        <div className="divider-plaid mx-8" />

        {/* Pricing */}
        <section className="px-8 py-24 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-4">
              Simple Pricing
            </h2>
            <p className="text-[var(--text-secondary)]">Free for personal use. Teams pay per seat.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="card-sharp p-8">
              <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold uppercase tracking-wider mb-2">
                Personal
              </h3>
              <div className="text-4xl font-[family-name:var(--font-heading)] font-bold mb-2">
                Free
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-6">Forever free for individual use</p>
              <ul className="space-y-3 mb-8 text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--accent-sage)]" />
                  Unlimited connected accounts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--accent-sage)]" />
                  All integrations
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--accent-sage)]" />
                  Community support
                </li>
              </ul>
              <Link href="/signup" className="block text-center py-3 border-2 border-[var(--text-primary)] font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-wider hover:bg-[var(--text-primary)] hover:text-[var(--bg-secondary)] transition-colors">
                Get Started
              </Link>
            </div>
            <div className="card-sharp p-8 border-[var(--accent-rust)] border-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--accent-rust)] text-white text-xs font-[family-name:var(--font-heading)] uppercase tracking-wider">
                For Teams
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold uppercase tracking-wider mb-2">
                Teams
              </h3>
              <div className="text-4xl font-[family-name:var(--font-heading)] font-bold mb-2">
                $15<span className="text-lg text-[var(--text-muted)]">/mo/seat</span>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-6">Billed monthly or annually</p>
              <ul className="space-y-3 mb-8 text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--accent-rust)]" />
                  Everything in Personal
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--accent-rust)]" />
                  Team sharing &amp; collaboration
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--accent-rust)]" />
                  Audit logs &amp; admin controls
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--accent-rust)]" />
                  Priority support
                </li>
              </ul>
              <Link href="mailto:jack@patchin.sh" className="block text-center py-3 bg-[var(--accent-rust)] text-white font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-wider hover:bg-[var(--accent-rust-dark)] transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-8 py-24 bg-[var(--text-primary)] text-[var(--bg-primary)]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-6">
              Ready to Connect Everything?
            </h2>
            <p className="text-lg text-[var(--bg-primary)]/70 mb-8 max-w-xl mx-auto">
              Join the open beta and start using your data with any AI agent today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--accent-rust)] text-white font-[family-name:var(--font-heading)] font-semibold uppercase tracking-wider hover:bg-[var(--accent-rust-dark)] transition-colors"
              >
                Get Started Free
              </Link>
              <Link 
                href="https://github.com/jackweatherilt/patchin"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-[var(--bg-primary)]/30 text-[var(--bg-primary)] font-[family-name:var(--font-heading)] font-semibold uppercase tracking-wider hover:bg-[var(--bg-primary)]/10 transition-colors"
              >
                View on GitHub
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="sheriff-badge" />
            <span className="font-[family-name:var(--font-heading)] font-bold">
              Patchin
            </span>
          </div>
          <div className="flex gap-8 text-sm text-[var(--text-muted)]">
            <Link href="https://github.com/jackweatherilt/patchin" className="hover:text-[var(--accent-rust)] transition-colors">
              GitHub
            </Link>
            <Link href="https://twitter.com/jackw_xyz" className="hover:text-[var(--accent-rust)] transition-colors">
              Twitter
            </Link>
            <Link href="/privacy" className="hover:text-[var(--accent-rust)] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--accent-rust)] transition-colors">
              Terms
            </Link>
            <Link href="mailto:jack@patchin.sh" className="hover:text-[var(--accent-rust)] transition-colors">
              Contact
            </Link>
          </div>
          <div className="text-sm text-[var(--text-muted)]">
            © 2026 Patchin. Built by{" "}
            <Link href="https://jackw.xyz" className="hover:text-[var(--accent-rust)] transition-colors">
              Jack Weatherilt
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
