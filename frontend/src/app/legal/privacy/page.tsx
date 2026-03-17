import Link from "next/link";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0]">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-[#c9a84c]" />
          <span className="text-xl font-bold text-[#1a2332]">LegacyGuard</span>
        </Link>
        <Link href="/signup" className="px-5 py-2.5 bg-[#1a2332] text-white rounded-lg text-sm font-semibold hover:bg-[#2a3a4f] transition-colors">
          Get Started
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a2332] mb-2">
          LegacyGuard Privacy Policy
        </h1>
        <p className="text-sm text-[#94a3b8] mb-12">Last updated: March 2026</p>

        <div className="space-y-10 text-[#64748b] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#1a2332] mb-3">1. Data Collection</h2>
            <p>
              LegacyGuard collects only the minimum data necessary to provide our service. This includes
              your email address, account preferences, check-in timestamps, plan configurations, and
              designated heir contact information. We do not collect or store your private keys, seed
              phrases, or wallet balances.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a2332] mb-3">2. Non-Custodial Data Handling</h2>
            <p>
              Due to our non-custodial architecture, we hold only one of three encrypted key shards.
              This single shard is mathematically useless on its own and cannot be used to access your
              crypto assets. Vault contents are encrypted on your device before transmission and cannot
              be read by LegacyGuard.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a2332] mb-3">3. How We Use Your Data</h2>
            <p>
              We use your data to operate the service, send check-in reminders, notify heirs when a
              switch is triggered, provide customer support, and send important service updates. We do
              not sell your personal data to third parties or use it for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a2332] mb-3">4. Cookies</h2>
            <p>
              LegacyGuard uses only essential cookies required to maintain your authenticated session.
              We do not use tracking cookies, analytics cookies, or third-party advertising cookies.
              You can manage cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a2332] mb-3">5. Data Security</h2>
            <p>
              All data is encrypted in transit using TLS 1.3 and at rest using AES-256-GCM. Our
              infrastructure is hosted on SOC 2 compliant providers. We conduct regular security
              audits and penetration testing to ensure the safety of your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a2332] mb-3">6. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. Upon account deletion,
              all personal data, vault data, heir configurations, and check-in history are permanently
              deleted within 30 days. Anonymized usage statistics may be retained for service improvement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a2332] mb-3">7. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data at any time. You may
              export your account data or request complete account deletion through the security settings
              page. We respond to all data requests within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a2332] mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify registered users of
              material changes via email. The latest version will always be available on this page.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e2e8f0]">
          <p className="text-sm text-[#94a3b8]">
            If you have questions about this policy, contact us at privacy@legacyguard.io.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a2332] py-8">
        <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">
          <p className="text-sm text-[#64748b]">
            &copy; 2026 LegacyGuard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
