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
                  Plaid for your data
                </span>
              </div>
              <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
                One connection.{" "}
                <span className="text-[var(--accent-rust)]">All your data.</span>
              </h1>
              <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-lg">
                Your AI agent needs access to Gmail, Slack, Notion, Linear, and a dozen other tools. Setting up each one is painful. Patchin lets you connect once and use everywhere.
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
                    Works with your favorite AI agents
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-[var(--accent-rust)]/10 text-[var(--accent-rust)] text-xs font-medium">Claude</span>
                    <span className="px-2 py-1 bg-[var(--accent-sage)]/10 text-[var(--accent-sage)] text-xs font-medium">Cursor</span>
                    <span className="px-2 py-1 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] text-xs font-medium">ChatGPT</span>
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
              You connect your accounts. Your AI agent does the rest.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-sharp p-8">
              <div className="w-12 h-12 bg-[var(--accent-rust)] flex items-center justify-center text-white font-[family-name:var(--font-heading)] text-xl font-bold mb-6">
                1
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-3">
                Connect Your Accounts
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Sign in with Google, Notion, Slack, Linear — whatever you use. One place for all your logins.
              </p>
            </div>
            <div className="card-sharp p-8">
              <div className="w-12 h-12 bg-[var(--accent-sage)] flex items-center justify-center text-white font-[family-name:var(--font-heading)] text-xl font-bold mb-6">
                2
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-3">
                Tell Your Agent
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Point your AI agent to Patchin. It handles the technical setup automatically.
              </p>
            </div>
            <div className="card-sharp p-8">
              <div className="w-12 h-12 bg-[var(--accent-gold)] flex items-center justify-center text-white font-[family-name:var(--font-heading)] text-xl font-bold mb-6">
                3
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-3">
                It Just Works
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Your agent can now read your emails, check your calendar, search your docs — whatever you need.
              </p>
            </div>
          </div>
        </section>

        <div className="divider-plaid mx-8" />

        {/* Agent Section */}
        <section className="px-8 py-24 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-4">
              Your Agent Does the Work
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              You don&apos;t need to be technical. Your AI agent handles the setup and knows how to use Patchin automatically.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="card-sharp p-6 bg-[var(--bg-tertiary)]">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[var(--accent-rust)]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[var(--accent-rust)] text-sm font-bold">You</span>
                  </div>
                  <div className="flex-1 p-3 border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                    <p className="text-sm text-[var(--text-secondary)]">
                      &ldquo;Check my calendar for tomorrow and summarize any emails from my boss&rdquo;
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[var(--accent-sage)]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[var(--accent-sage)] text-sm font-bold">AI</span>
                  </div>
                  <div className="flex-1 p-3 border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                    <p className="text-sm text-[var(--text-secondary)]">
                      &ldquo;You have 3 meetings tomorrow. I found 2 emails from Sarah — she&apos;s asking about the Q3 report deadline...&rdquo;
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[var(--border-color)] text-center">
                  <p className="text-xs text-[var(--text-muted)]">
                    Behind the scenes, your agent uses Patchin to access Google Calendar and Gmail
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-4">
                No Technical Skills Required
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Normally, connecting your AI agent to your data means dealing with OAuth flows, API keys, and configuration files. Patchin handles all of that for you.
              </p>
              <ul className="space-y-4 text-[var(--text-secondary)]">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[var(--accent-sage)] mt-2 flex-shrink-0" />
                  <span><strong className="text-[var(--text-primary)]">You</strong> connect your accounts through a simple web interface</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[var(--accent-sage)] mt-2 flex-shrink-0" />
                  <span><strong className="text-[var(--text-primary)]">Your agent</strong> handles the technical bits automatically</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[var(--accent-sage)] mt-2 flex-shrink-0" />
                  <span><strong className="text-[var(--text-primary)]">Everything</strong> stays secure — we never see your data, just the login handshake</span>
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
            Your Data Stays Yours
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto leading-relaxed">
            Patchin only handles the login — we never see your emails, files, or messages. Your data flows directly between your agent and your services. Open source, so you can verify it yourself.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-4 py-2 border border-[var(--border-color)] font-[family-name:var(--font-heading)] uppercase tracking-wider">
              We Never See Your Data
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
              Stop Setting Up Integrations
            </h2>
            <p className="text-lg text-[var(--bg-primary)]/70 mb-8 max-w-xl mx-auto">
              Connect your accounts once. Let your AI agent handle the rest.
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
