import Link from "next/link";
import { Shield, Key, Users, Clock } from "lucide-react";

const steps = [
  {
    icon: Key,
    title: "Set Up in Minutes",
    description:
      "Create your vault and split your key using military-grade Shamir Secret Sharing.",
  },
  {
    icon: Users,
    title: "Designate Your Heirs",
    description:
      "Choose trusted family members or friends who will inherit your crypto assets.",
  },
  {
    icon: Clock,
    title: "Peace of Mind",
    description:
      "Regular check-ins ensure your plan activates only when needed. Your family is protected.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 bg-surface border-b border-border">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-gold" />
          <span className="text-xl font-bold text-navy">LegacyGuard</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/signup"
            className="text-sm font-medium text-text-secondary hover:text-navy transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 bg-navy text-white rounded-lg font-semibold hover:bg-navy-light transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full mb-8">
          <Shield className="w-4 h-4 text-gold" />
          <span className="text-sm font-medium text-gold">
            Non-Custodial &middot; Zero-Knowledge &middot; Audited
          </span>
        </div>
        <h1 className="text-5xl font-bold text-navy leading-tight tracking-tight mb-6">
          Protect Your Crypto Legacy
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          Ensure your digital assets reach the right people. LegacyGuard uses
          advanced cryptographic key splitting so no single party ever holds your
          complete key.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="px-8 py-4 bg-navy text-white rounded-lg text-lg font-semibold hover:bg-navy-light hover:shadow-lg transition-all"
          >
            Start Protecting Your Legacy
          </Link>
          <Link
            href="/security"
            className="px-8 py-4 border border-navy text-navy rounded-lg text-lg font-semibold hover:bg-navy hover:text-white transition-all"
          >
            How It Works
          </Link>
        </div>
      </section>

      {/* 3-Step Value Prop */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <h2 className="text-3xl font-bold text-navy text-center mb-12">
          Three Steps to Security
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="bg-surface rounded-xl border border-border p-8 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-gold" />
                </div>
                <div className="text-sm font-semibold text-gold mb-2">
                  Step {i + 1}
                </div>
                <h3 className="text-xl font-semibold text-navy mb-3">
                  {step.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust Footer */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-sm text-text-muted">
          LegacyGuard never has access to your private keys or crypto assets.
        </p>
      </footer>
    </div>
  );
}
