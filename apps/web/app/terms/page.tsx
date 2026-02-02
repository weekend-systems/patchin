import Link from "next/link";

export default function TermsOfService() {
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
          Terms of Service
        </h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-[var(--text-secondary)]">
          <p className="text-sm text-[var(--text-muted)]">
            Last updated: February 2, 2026
          </p>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Agreement to Terms
            </h2>
            <p>
              By accessing or using Patchin (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Description of Service
            </h2>
            <p>
              Patchin is a token broker service that enables you to connect your third-party accounts (such as Google, Notion, Slack, and others) and access them through AI agents via the Model Context Protocol (MCP). We provide OAuth token management and a CLI/API interface for making authenticated requests to connected services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Account Registration
            </h2>
            <p>
              To use Patchin, you must create an account. You agree to provide accurate information and keep your account credentials secure. You are responsible for all activity that occurs under your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use the Service to violate the terms of any connected third-party service</li>
              <li>Share your account credentials with others</li>
              <li>Use the Service to transmit malware or other harmful code</li>
              <li>Reverse engineer or attempt to extract the source code of the Service</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Third-Party Services
            </h2>
            <p>
              Patchin integrates with third-party services. Your use of those services through Patchin is also subject to their respective terms of service and privacy policies. We are not responsible for the availability, accuracy, or content of third-party services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Pricing and Payment
            </h2>
            <p>
              <strong>Personal Plan:</strong> The personal plan is free and includes unlimited connected accounts and all integrations.
            </p>
            <p>
              <strong>Teams Plan:</strong> The teams plan is $15 per seat per month. Payment is due monthly or annually as selected. We may change pricing with 30 days notice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Intellectual Property
            </h2>
            <p>
              The Service, including its original content, features, and functionality, is owned by Patchin and is protected by intellectual property laws. Our code is open source under the license specified in our GitHub repository.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Disclaimer of Warranties
            </h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Limitation of Liability
            </h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, PATCHIN SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Termination
            </h2>
            <p>
              We may terminate or suspend your account at any time for any reason, including violation of these terms. You may terminate your account at any time by contacting us. Upon termination, your right to use the Service will cease immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Changes to Terms
            </h2>
            <p>
              We may modify these terms at any time. We will notify you of material changes by posting the new terms on this page. Your continued use of the Service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Governing Law
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the United Kingdom, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text-primary)]">
              Contact Us
            </h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{" "}
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
