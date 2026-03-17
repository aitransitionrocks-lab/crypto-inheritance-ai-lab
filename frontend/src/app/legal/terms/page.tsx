import Link from "next/link";
import { Shield } from "lucide-react";

export default function TermsPage() {
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
          LegacyGuard Terms of Service
        </h1>
        <p className="text-sm text-[#94a3b8] mb-12">Last updated: March 2026</p>

        <div className="space-y-10 text-[#64748b] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#1a2332] mb-3">1. Service Description</h2>
            <p>
              LegacyGuard provides a non-custodial crypto inheritance planning platform that enables users
              to create encrypted vaults, designate heirs, and configure automated dead man&apos;s switch
              check-in protocols. Our service facilitates the secure transfer of access instructions to
              designated beneficiaries upon triggering of the configured switch.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a2332] mb-3">2. Non-Custodial Architecture</h2>
            <p>
              LegacyGuard is non-custodial by design. We never have access to your private keys, seed
              phrases, or crypto assets. Your encryption key is split into three shards using Shamir&apos;s
              Secret Sharing. LegacyGuard holds only one shard, which alone is mathematically insufficient
              to reconstruct your key. You acknowledge that LegacyGuard cannot recover lost keys or
              access your assets under any circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a2332] mb-3">3. User Responsibilities</h2>
            <p>
              You are responsible for maintaining the security of your account credentials, ensuring your
              check-in schedule is maintained, keeping your heir information up to date, and safeguarding
              your device shard. Failure to check in within your configured interval may trigger the
              inheritance process. LegacyGuard is not responsible for unintended triggers due to missed
              check-ins.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a2332] mb-3">4. Account Eligibility</h2>
            <p>
              You must be at least 18 years of age and have the legal capacity to enter into a binding
              agreement to use LegacyGuard. By creating an account, you represent that the information
              you provide is accurate and complete.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a2332] mb-3">5. Subscription & Billing</h2>
            <p>
              LegacyGuard offers free and paid subscription tiers. Paid subscriptions are billed monthly.
              You may cancel at any time, and your subscription will remain active until the end of the
              current billing period. Refunds are not provided for partial billing periods.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a2332] mb-3">6. Limitation of Liability</h2>
            <p>
              LegacyGuard provides the service &quot;as is&quot; without warranties of any kind. We are not
              liable for any loss of crypto assets, missed inheritance transfers, or damages arising from
              the use or inability to use the service. Our total liability shall not exceed the amount
              paid by you in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a2332] mb-3">7. Termination</h2>
            <p>
              You may terminate your account at any time through the account settings. Upon termination,
              your vault data, heir configurations, and check-in history will be permanently deleted.
              LegacyGuard reserves the right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a2332] mb-3">8. Changes to Terms</h2>
            <p>
              We may update these Terms of Service from time to time. We will notify registered users of
              material changes via email. Continued use of the service after changes constitutes acceptance
              of the updated terms.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e2e8f0]">
          <p className="text-sm text-[#94a3b8]">
            If you have questions about these terms, contact us at legal@legacyguard.io.
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
