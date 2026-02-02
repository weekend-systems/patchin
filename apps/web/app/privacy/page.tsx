import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="plaid-bg min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-[var(--border-color)]">
        <Link href="/" className="flex items-center gap-2">
          <div className="sheriff-badge" />
          <span className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight">
            Patchin
          </span>
        </Link>
      </nav>

      <main className="px-8 py-16 max-w-3xl mx-auto">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-[var(--text-secondary)]">
          <p className="text-sm text-[var(--text-muted)]">
            Last updated: February 2, 2026
          </p>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Overview
            </h2>
            <p>
              Patchin (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is a token broker service that helps you connect your accounts to AI agents via the Model Context Protocol (MCP). This Privacy Policy explains how we handle your information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              What We Collect
            </h2>
            <p>
              <strong>Account Information:</strong> When you sign up, we collect your email address and name to create your account.
            </p>
            <p>
              <strong>OAuth Tokens:</strong> When you connect services (Google, Notion, Slack, etc.), we store encrypted OAuth tokens that allow you to access those services through Patchin.
            </p>
            <p>
              <strong>Usage Data:</strong> We collect basic usage analytics such as which integrations you use and when, to improve our service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              What We Don&apos;t Collect
            </h2>
            <p>
              <strong>Your Data:</strong> Patchin is a token broker, not a data proxy. When you make API calls through Patchin, your requests go directly to the service provider (Google, Notion, etc.). We never see, store, or process the actual data from your connected accounts.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain the Patchin service</li>
              <li>To authenticate you and manage your connected accounts</li>
              <li>To communicate with you about service updates</li>
              <li>To improve our service based on usage patterns</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Data Security
            </h2>
            <p>
              All OAuth tokens are encrypted at rest using industry-standard encryption. We use secure HTTPS connections for all data transmission. Our infrastructure is hosted on reputable cloud providers with SOC 2 compliance.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Data Retention
            </h2>
            <p>
              We retain your account information and OAuth tokens for as long as your account is active. When you disconnect a service or delete your account, we delete the associated tokens immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Third-Party Services
            </h2>
            <p>
              When you connect services through Patchin, you are also subject to those services&apos; privacy policies. We encourage you to review the privacy policies of any service you connect.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Your Rights
            </h2>
            <p>
              You can disconnect any connected service at any time from your dashboard. You can request deletion of your account and all associated data by contacting us at{" "}
              <Link href="mailto:jack@patchin.sh" className="text-[var(--accent-rust)] hover:underline">
                jack@patchin.sh
              </Link>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <Link href="mailto:jack@patchin.sh" className="text-[var(--accent-rust)] hover:underline">
                jack@patchin.sh
              </Link>.
            </p>
          </section>
        </div>
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
