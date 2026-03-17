"use client";

import Link from "next/link";
import { Shield, CheckCircle, ArrowRight } from "lucide-react";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Get started and protect your first vault.",
    features: [
      "1 vault",
      "1 heir",
      "Email check-in",
      "90-day minimum trigger",
      "Basic dashboard",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    desc: "Full protection for serious crypto holders.",
    features: [
      "Unlimited vaults & heirs",
      "Custom trigger intervals (30-365 days)",
      "Email, SMS & app check-in",
      "Advanced security dashboard",
      "Priority support",
      "Multi-chain support",
    ],
    cta: "Start 14-Day Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$499",
    period: "/month",
    desc: "For family offices, partners & institutions.",
    features: [
      "Everything in Pro",
      "API & SDK access",
      "White-label integration",
      "Custom SLA",
      "Dedicated account manager",
      "Compliance reports",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0]">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-[#c9a84c]" />
          <span className="text-xl font-bold text-[#1a2332]">LegacyGuard</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/#how-it-works" className="text-[#64748b] hover:text-[#1a2332] transition-colors">How It Works</Link>
          <Link href="/#trust" className="text-[#64748b] hover:text-[#1a2332] transition-colors">Security</Link>
          <Link href="/pricing" className="text-[#1a2332] font-semibold">Pricing</Link>
          <Link href="/#faq" className="text-[#64748b] hover:text-[#1a2332] transition-colors">FAQ</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/signup" className="text-sm font-medium text-[#64748b] hover:text-[#1a2332] hidden md:block">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 bg-[#1a2332] text-white rounded-lg text-sm font-semibold hover:bg-[#2a3a4f] transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a2332] mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
            Start free. Upgrade when you need more protection. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border-2 ${
                  plan.highlight
                    ? "border-[#c9a84c] bg-white shadow-lg relative"
                    : "border-[#e2e8f0] bg-white"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#c9a84c] text-white text-sm font-bold rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#1a2332] mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-[#1a2332]">{plan.price}</span>
                  <span className="text-[#64748b]">{plan.period}</span>
                </div>
                <p className="text-[#64748b] text-sm mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                      <span className="text-[#0f172a]">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
                    plan.highlight
                      ? "bg-[#1a2332] text-white hover:bg-[#2a3a4f]"
                      : "bg-[#f8fafc] text-[#1a2332] border border-[#e2e8f0] hover:bg-[#e2e8f0]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="bg-[#f1f5f9] py-16">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-2xl font-bold text-[#1a2332] mb-4">Have Questions?</h2>
          <p className="text-[#64748b] mb-6">
            Check out our FAQ or get in touch with our team.
          </p>
          <Link
            href="/#faq"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a2332] text-white rounded-xl font-semibold hover:bg-[#2a3a4f] transition-colors"
          >
            View FAQ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

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
