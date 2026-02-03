import Link from "next/link";

export default function Home() {
  return (
    <div className="plaid-bg min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <div className="sheriff-badge" />
          <span className="text-base font-semibold tracking-tight">
            Patchin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="btn-primary"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="px-6 py-16 md:py-20 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-1 border border-[var(--border-color)] rounded-md mb-4">
                <div className="sheriff-badge w-3 h-3" />
                <span className="text-label">
                  Plaid for your data
                </span>
              </div>
              <h1 className="font-medium text-3xl md:text-4xl font-semibold leading-[1.15] tracking-tight mb-4">
                One connection.{" "}
                <span className="text-[var(--accent-rust)]">All your data.</span>
              </h1>
              <p className="text-[14px] text-[var(--text-secondary)] mb-6 leading-relaxed max-w-md">
                Your AI agent needs access to Gmail, Slack, Notion, Linear, and a dozen other tools. Setting up each one is painful. Patchin lets you connect once and use everywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/signup" className="btn-primary">
                  Start Free
                </Link>
                <Link href="#how-it-works" className="btn-secondary">
                  See How It Works
                </Link>
              </div>
              <div className="mt-6 p-3 border border-[var(--border-color)] rounded-md bg-[var(--bg-secondary)]">
                <p className="text-[13px] text-[var(--text-secondary)]">
                  <span className="font-medium text-[var(--text-primary)]">Quick setup:</span>{" "}
                  Ask your AI to read{" "}
                  <code className="px-1 py-0.5 bg-[var(--bg-primary)] text-[var(--accent-rust)] font-mono text-[12px] rounded">
                    https://patchin.sh/skill.md
                  </code>
                </p>
              </div>
            </div>
            <div className="relative">
              {/* Visual representation of connected services */}
              <div className="card-sharp p-4 space-y-3">
                <div className="flex items-center gap-3 p-2.5 border border-[var(--border-color)] rounded-md">
                  <div className="w-8 h-8 service-icon-google rounded flex items-center justify-center text-white font-bold text-[11px]">G</div>
                  <div className="flex-1">
                    <div className="font-medium text-[13px]">Google Workspace</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Connected</div>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-sage)]" />
                </div>
                <div className="flex items-center gap-3 p-2.5 border border-[var(--border-color)] rounded-md">
                  <div className="w-8 h-8 service-icon-notion rounded flex items-center justify-center text-white font-bold text-[11px]">N</div>
                  <div className="flex-1">
                    <div className="font-medium text-[13px]">Notion</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Connected</div>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-sage)]" />
                </div>
                <div className="flex items-center gap-3 p-2.5 border border-[var(--border-color)] rounded-md">
                  <div className="w-8 h-8 service-icon-linear rounded flex items-center justify-center text-white font-bold text-[11px]">L</div>
                  <div className="flex-1">
                    <div className="font-medium text-[13px]">Linear</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Connected</div>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-sage)]" />
                </div>
                <div className="flex items-center gap-3 p-2.5 border border-[var(--border-color)] rounded-md">
                  <div className="w-8 h-8 service-icon-slack rounded flex items-center justify-center text-white font-bold text-[11px]">S</div>
                  <div className="flex-1">
                    <div className="font-medium text-[13px]">Slack</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Connected</div>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-sage)]" />
                </div>
                <div className="pt-3 border-t border-[var(--border-color)]">
                  <div className="text-label mb-2">
                    Works with your favorite AI agents
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-[var(--accent-rust)]/10 text-[var(--accent-rust)] text-[11px] font-medium rounded">Claude</span>
                    <span className="px-2 py-0.5 bg-[var(--accent-sage)]/10 text-[var(--accent-sage)] text-[11px] font-medium rounded">Cursor</span>
                    <span className="px-2 py-0.5 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] text-[11px] font-medium rounded">ChatGPT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider-subtle mx-6" />

        {/* How It Works */}
        <section id="how-it-works" className="px-6 py-16 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-medium text-2xl md:text-3xl font-semibold mb-3">
              How It Works
            </h2>
            <p className="text-[14px] text-[var(--text-secondary)] max-w-lg mx-auto">
              You connect your accounts. Your AI agent does the rest.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card-sharp p-4">
              <div className="w-8 h-8 bg-[var(--accent-rust)] rounded flex items-center justify-center text-white font-medium text-[14px] font-semibold mb-4">
                1
              </div>
              <h3 className="font-medium text-[16px] font-semibold mb-2">
                Connect Your Accounts
              </h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                Sign in with Google, Notion, Slack, Linear — whatever you use. One place for all your logins.
              </p>
            </div>
            <div className="card-sharp p-4">
              <div className="w-8 h-8 bg-[var(--accent-sage)] rounded flex items-center justify-center text-white font-medium text-[14px] font-semibold mb-4">
                2
              </div>
              <h3 className="font-medium text-[16px] font-semibold mb-2">
                Tell Your Agent
              </h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                Point your AI agent to Patchin. It handles the technical setup automatically.
              </p>
            </div>
            <div className="card-sharp p-4">
              <div className="w-8 h-8 bg-[var(--accent-gold)] rounded flex items-center justify-center text-white font-medium text-[14px] font-semibold mb-4">
                3
              </div>
              <h3 className="font-medium text-[16px] font-semibold mb-2">
                It Just Works
              </h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                Your agent can now read your emails, check your calendar, search your docs — whatever you need.
              </p>
            </div>
          </div>
        </section>

        <div className="divider-subtle mx-6" />

        {/* Agent Section */}
        <section className="px-6 py-16 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-medium text-2xl md:text-3xl font-semibold mb-3">
              Your Agent Does the Work
            </h2>
            <p className="text-[14px] text-[var(--text-secondary)] max-w-lg mx-auto">
              You don&apos;t need to be technical. Your AI agent handles the setup and knows how to use Patchin automatically.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="card-sharp p-4 bg-[var(--bg-secondary)]">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[var(--accent-rust)]/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[var(--accent-rust)] text-[11px] font-semibold">You</span>
                  </div>
                  <div className="flex-1 p-2.5 border border-[var(--border-color)] rounded-md bg-[var(--bg-card)]">
                    <p className="text-[13px] text-[var(--text-secondary)]">
                      &ldquo;Check my calendar for tomorrow and summarize any emails from my boss&rdquo;
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[var(--accent-sage)]/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[var(--accent-sage)] text-[11px] font-semibold">AI</span>
                  </div>
                  <div className="flex-1 p-2.5 border border-[var(--border-color)] rounded-md bg-[var(--bg-card)]">
                    <p className="text-[13px] text-[var(--text-secondary)]">
                      &ldquo;You have 3 meetings tomorrow. I found 2 emails from Sarah — she&apos;s asking about the Q3 report deadline...&rdquo;
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-[var(--border-color)] text-center">
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Behind the scenes, your agent uses Patchin to access Google Calendar and Gmail
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-[16px] font-semibold mb-3">
                No Technical Skills Required
              </h3>
              <p className="text-[13px] text-[var(--text-secondary)] mb-4">
                Normally, connecting your AI agent to your data means dealing with OAuth flows, API keys, and configuration files. Patchin handles all of that for you.
              </p>
              <ul className="space-y-3 text-[13px] text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--accent-sage)] mt-2 flex-shrink-0" />
                  <span><strong className="text-[var(--text-primary)]">You</strong> connect your accounts through a simple web interface</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--accent-sage)] mt-2 flex-shrink-0" />
                  <span><strong className="text-[var(--text-primary)]">Your agent</strong> handles the technical bits automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--accent-sage)] mt-2 flex-shrink-0" />
                  <span><strong className="text-[var(--text-primary)]">Everything</strong> stays secure — we never see your data, just the login handshake</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="divider-subtle mx-6" />

        {/* Security Badge Section */}
        <section className="px-6 py-16 max-w-3xl mx-auto text-center">
          <div className="sheriff-badge sheriff-badge-lg mx-auto mb-4" />
          <h2 className="font-medium text-2xl md:text-3xl font-semibold mb-4">
            Your Data Stays Yours
          </h2>
          <p className="text-[14px] text-[var(--text-secondary)] mb-6 max-w-xl mx-auto leading-relaxed">
            Patchin only handles the login — we never see your emails, files, or messages. Your data flows directly between your agent and your services. Open source, so you can verify it yourself.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-[11px]">
            <span className="px-3 py-1.5 border border-[var(--border-color)] rounded-md text-label">
              We Never See Your Data
            </span>
            <span className="px-3 py-1.5 border border-[var(--border-color)] rounded-md text-label">
              Open Source
            </span>
            <span className="px-3 py-1.5 border border-[var(--border-color)] rounded-md text-label">
              Self-Hostable
            </span>
          </div>
        </section>

        <div className="divider-subtle mx-6" />

        {/* Pricing */}
        <section className="px-6 py-16 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-medium text-2xl md:text-3xl font-semibold mb-3">
              Simple Pricing
            </h2>
            <p className="text-[14px] text-[var(--text-secondary)]">Free for personal use. Teams pay per seat.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="card-sharp p-4">
              <h3 className="font-medium text-[14px] font-semibold mb-1">
                Personal
              </h3>
              <div className="text-2xl font-semibold mb-1">
                Free
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mb-4">Forever free for individual use</p>
              <ul className="space-y-2 mb-4 text-[13px] text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--accent-sage)]" />
                  Unlimited connected accounts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--accent-sage)]" />
                  All integrations
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--accent-sage)]" />
                  Community support
                </li>
              </ul>
              <Link href="/signup" className="btn-secondary w-full justify-center">
                Get Started
              </Link>
            </div>
            <div className="card-sharp p-4 border-[var(--accent-rust)] relative">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[var(--accent-rust)] text-white text-[10px] font-medium rounded">
                For Teams
              </div>
              <h3 className="font-medium text-[14px] font-semibold mb-1">
                Teams
              </h3>
              <div className="text-2xl font-semibold mb-1">
                $15<span className="text-[14px] text-[var(--text-muted)]">/mo/seat</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mb-4">Billed monthly or annually</p>
              <ul className="space-y-2 mb-4 text-[13px] text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--accent-rust)]" />
                  Everything in Personal
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--accent-rust)]" />
                  Team sharing &amp; collaboration
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--accent-rust)]" />
                  Audit logs &amp; admin controls
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--accent-rust)]" />
                  Priority support
                </li>
              </ul>
              <Link href="mailto:jack@patchin.sh" className="btn-primary w-full justify-center">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 bg-[var(--text-primary)] text-[var(--bg-primary)]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-medium text-2xl md:text-3xl font-semibold mb-4">
              Stop Setting Up Integrations
            </h2>
            <p className="text-[14px] text-[var(--bg-primary)]/60 mb-6 max-w-md mx-auto">
              Connect your accounts once. Let your AI agent handle the rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center h-8 px-4 bg-[var(--accent-rust)] text-white text-[13px] font-medium rounded-md hover:bg-[var(--accent-rust-dark)] transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="https://github.com/jackweatherilt/patchin"
                className="inline-flex items-center justify-center h-8 px-4 border border-[var(--bg-primary)]/20 text-[var(--bg-primary)] text-[13px] font-medium rounded-md hover:bg-[var(--bg-primary)]/10 transition-colors"
              >
                View on GitHub
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[var(--border-color)]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="sheriff-badge" />
            <span className="font-semibold text-[14px]">
              Patchin
            </span>
          </div>
          <div className="flex gap-6 text-[13px] text-[var(--text-muted)]">
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
          <div className="text-[13px] text-[var(--text-muted)]">
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
