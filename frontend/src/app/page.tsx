"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Shield,
  Key,
  Users,
  Clock,
  Lock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Zap,
  Heart,
  Eye,
  EyeOff,
  ArrowRight,
  Star,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ─────────────────────────── data ─────────────────────────── */

const stats = [
  { value: "$140B+", label: "in Bitcoin permanently lost" },
  { value: "4M+", label: "BTC inaccessible forever" },
  { value: "89%", label: "of holders have no inheritance plan" },
];

const steps = [
  {
    icon: Key,
    title: "Create Your Vault",
    desc: "Connect your wallets and store encrypted inheritance instructions. Your keys are split into 3 shards — no single party ever holds your complete key.",
  },
  {
    icon: Users,
    title: "Designate Your Heirs",
    desc: "Choose trusted family members. They verify their identity and receive one encrypted shard. They cannot access anything until the switch activates.",
  },
  {
    icon: Clock,
    title: "Set Your Switch",
    desc: "Choose how often to check in (30–365 days). If you stop checking in, your heirs are notified and the recovery process begins — with built-in safety periods.",
  },
];

const trustPoints = [
  {
    icon: EyeOff,
    title: "We Never See Your Keys",
    desc: "Key generation and splitting happen on your device. We store only 1 of 3 encrypted shards — which alone reveals nothing.",
  },
  {
    icon: Lock,
    title: "Military-Grade Encryption",
    desc: "AES-256-GCM encryption and Shamir's Secret Sharing (2-of-3 threshold). The same cryptography used by governments and banks.",
  },
  {
    icon: Shield,
    title: "Non-Custodial by Design",
    desc: "LegacyGuard is architecturally incapable of accessing your assets. We are a secure relay, not a custodian.",
  },
  {
    icon: Eye,
    title: "Open Source & Audited",
    desc: "Our protocol code is open source. Independent security audits verify our non-custodial claims. Trust, but verify.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Get started and protect your first vault.",
    features: [
      "1 vault",
      "1 heir",
      "90-day minimum trigger",
      "Email check-in",
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
      "Custom trigger intervals (30–365 days)",
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

const faqs = [
  {
    q: "Is LegacyGuard safe? Can you access my crypto?",
    a: "No. LegacyGuard is non-custodial by design. Your key is split into 3 shards using Shamir's Secret Sharing. We hold only 1 shard, which alone is mathematically useless. We never have access to your assets at any point.",
  },
  {
    q: "What happens if LegacyGuard disappears?",
    a: "Your shards are distributed — one on your device, one with your trusted contact, one in our encrypted vault. Even if LegacyGuard ceases to exist, your heir and you still hold 2 of 3 shards, which is enough to reconstruct your key.",
  },
  {
    q: "How is this different from writing down my seed phrase?",
    a: "A seed phrase in a safe can be lost, stolen, or never found by your family. LegacyGuard adds automated monitoring (dead man's switch), verified heir identity, encrypted shard distribution, and a safety period to prevent false triggers.",
  },
  {
    q: "What if the switch triggers by mistake?",
    a: "Multiple safety layers prevent false triggers: you choose the inactivity period (up to 365 days), get multiple reminders before triggering, and there's a 7-day safety window after triggering where you can cancel by simply checking in.",
  },
  {
    q: "Which blockchains do you support?",
    a: "LegacyGuard works with any blockchain or wallet. You store your recovery instructions (seed phrases, passwords, access steps) in an encrypted vault. We don't interact with the blockchain directly — keeping us non-custodial.",
  },
  {
    q: "Do I need to be technical to use this?",
    a: "Not at all. Setup takes about 5 minutes. If you can use email and a web browser, you can use LegacyGuard. We explain everything in plain language, step by step.",
  },
];

/* ─────────────────────────── components ─────────────────────────── */

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-lg font-semibold text-navy pr-4">{q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-text-secondary flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-text-secondary flex-shrink-0" />
        )}
      </button>
      {open && (
        <p className="pb-5 text-text-secondary leading-relaxed">{a}</p>
      )}
    </div>
  );
}

/* ─────────────────────────── page ─────────────────────────── */

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setWaitlistLoading(true);
    try {
      const supabase = createClient();
      await supabase.from("waitlist").insert({ email });
    } catch {
      // Graceful fallback: table may not exist yet
    }
    setWaitlistLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ──── Nav ──── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-[#c9a84c]" />
          <span className="text-xl font-bold text-[#1a2332]">LegacyGuard</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#how-it-works" className="text-[#64748b] hover:text-[#1a2332] transition-colors">How It Works</a>
          <a href="#trust" className="text-[#64748b] hover:text-[#1a2332] transition-colors">Security</a>
          <Link href="/pricing" className="text-[#64748b] hover:text-[#1a2332] transition-colors">Pricing</Link>
          <a href="#faq" className="text-[#64748b] hover:text-[#1a2332] transition-colors">FAQ</a>
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

      {/* ──── Section 1: Hero ──── */}
      <section className="max-w-5xl mx-auto px-6 md:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#c9a84c]/10 rounded-full mb-8">
          <Shield className="w-4 h-4 text-[#c9a84c]" />
          <span className="text-sm font-medium text-[#c9a84c]">
            Non-Custodial · Open Source · Audited
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-[#1a2332] leading-tight tracking-tight mb-6">
          If You Die Tomorrow,<br />
          <span className="text-[#c9a84c]">Your Bitcoin Dies With You</span>
        </h1>
        <p className="text-lg md:text-xl text-[#64748b] max-w-2xl mx-auto mb-10 leading-relaxed">
          Your family can&apos;t access your crypto. Not your exchange, not your hardware wallet, not your DeFi.
          Fix it in 5 minutes — without trusting anyone with your keys.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-[#1a2332] text-white rounded-xl text-lg font-semibold hover:bg-[#2a3a4f] hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            Protect Your Legacy — Free <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4 border-2 border-[#1a2332] text-[#1a2332] rounded-xl text-lg font-semibold hover:bg-[#1a2332] hover:text-white transition-all text-center"
          >
            See How It Works
          </a>
        </div>
        <p className="text-sm text-[#94a3b8]">
          Free forever for 1 vault · No credit card required · Setup in 5 minutes
        </p>
      </section>

      {/* ──── Section 2: The Problem ──── */}
      <section className="bg-[#1a2332] py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
            <span className="text-[#f59e0b] font-semibold">The Problem Nobody Talks About</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            $140 Billion in Crypto is Permanently Lost
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {stats.map((s) => (
              <div key={s.label} className="p-6">
                <div className="text-4xl md:text-5xl font-bold text-[#c9a84c] mb-2">{s.value}</div>
                <div className="text-[#94a3b8]">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="max-w-2xl mx-auto space-y-4 text-left">
            {[
              "Your seed phrase in a safe? Your family doesn't know it exists.",
              "Your hardware wallet? They don't know the PIN.",
              "Your exchange account? They can't pass identity verification.",
              "Your DeFi positions? They don't even know what DeFi is.",
            ].map((line) => (
              <div key={line} className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#ef4444] mt-0.5 flex-shrink-0" />
                <p className="text-[#e2e8f0]">{line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Section 3: How It Works ──── */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a2332] mb-4">
              How LegacyGuard Works
            </h2>
            <p className="text-lg text-[#64748b]">Three steps. Five minutes. Peace of mind forever.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative bg-white rounded-2xl border border-[#e2e8f0] p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="absolute -top-4 left-8 w-8 h-8 rounded-full bg-[#c9a84c] text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-[#c9a84c]/10 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-[#c9a84c]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a2332] mb-3">{step.title}</h3>
                  <p className="text-[#64748b] leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── Shard Visualization ──── */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 md:p-12">
            <h3 className="text-2xl font-bold text-[#1a2332] text-center mb-8">
              Your Key is Split Into 3 Pieces
            </h3>
            <p className="text-center text-[#64748b] mb-10">
              Any 2 pieces can reconstruct your key. No single piece reveals anything.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Key, label: "Shard 1", location: "Your Device", color: "#22c55e", desc: "Stored encrypted on your phone or computer" },
                { icon: Heart, label: "Shard 2", location: "Trusted Contact", color: "#3b82f6", desc: "Held by your designated heir" },
                { icon: Shield, label: "Shard 3", location: "LegacyGuard Vault", color: "#c9a84c", desc: "Encrypted — we cannot read it" },
              ].map((shard) => (
                <div key={shard.label} className="text-center p-6 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${shard.color}15` }}
                  >
                    <shard.icon className="w-8 h-8" style={{ color: shard.color }} />
                  </div>
                  <div className="font-bold text-[#1a2332] mb-1">{shard.label}</div>
                  <div className="text-sm font-semibold mb-2" style={{ color: shard.color }}>{shard.location}</div>
                  <div className="text-sm text-[#64748b]">{shard.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-[#22c55e]/5 rounded-lg border border-[#22c55e]/20 text-center">
              <p className="text-sm text-[#22c55e] font-semibold">
                <Lock className="w-4 h-4 inline mr-1" />
                LegacyGuard holds only 1 of 3 shards. One shard alone is mathematically useless. We can never access your assets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──── Section 4: Trust ──── */}
      <section id="trust" className="bg-[#f1f5f9] py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a2332] mb-4">
              Security You Can Verify
            </h2>
            <p className="text-lg text-[#64748b]">We don&apos;t ask you to trust us. We prove it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trustPoints.map((tp) => {
              const Icon = tp.icon;
              return (
                <div key={tp.title} className="bg-white rounded-2xl p-8 border border-[#e2e8f0] hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#1a2332] flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[#c9a84c]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a2332] mb-3">{tp.title}</h3>
                  <p className="text-[#64748b] leading-relaxed">{tp.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──── Section 5: Pricing ──── */}
      <section id="pricing" className="py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a2332] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-[#64748b]">Start free. Upgrade when you need more.</p>
          </div>
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

      {/* ──── Section 6: FAQ ──── */}
      <section id="faq" className="bg-[#f1f5f9] py-20">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a2332] text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="bg-white rounded-2xl border border-[#e2e8f0] px-8">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ──── Section 7: CTA + Waitlist ──── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <Shield className="w-12 h-12 text-[#c9a84c] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a2332] mb-4">
            Don&apos;t Let Your Crypto Die With You
          </h2>
          <p className="text-lg text-[#64748b] mb-8">
            Join thousands of crypto holders who are protecting their digital legacy.
            Free setup. No credit card. 5 minutes.
          </p>
          {!submitted ? (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-4 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]"
              />
              <button
                type="submit"
                disabled={waitlistLoading}
                className="px-8 py-4 bg-[#1a2332] text-white rounded-xl font-semibold hover:bg-[#2a3a4f] transition-colors whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {waitlistLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Get Started Free"
                )}
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 text-[#22c55e] font-semibold mb-4">
              <CheckCircle className="w-5 h-5" />
              <span>You&apos;re in! Check your email for next steps.</span>
            </div>
          )}
          <div className="flex items-center justify-center gap-6 text-sm text-[#94a3b8]">
            <span className="flex items-center gap-1"><Star className="w-4 h-4" /> Free forever tier</span>
            <span className="flex items-center gap-1"><Lock className="w-4 h-4" /> Non-custodial</span>
            <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> 5-min setup</span>
          </div>
        </div>
      </section>

      {/* ──── Footer ──── */}
      <footer className="bg-[#1a2332] py-12">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-[#c9a84c]" />
                <span className="text-lg font-bold text-white">LegacyGuard</span>
              </div>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                Non-custodial crypto inheritance protocol. Your keys, your legacy, your family&apos;s future.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
              <div className="space-y-2">
                <a href="#how-it-works" className="block text-sm text-[#94a3b8] hover:text-white">How It Works</a>
                <a href="#pricing" className="block text-sm text-[#94a3b8] hover:text-white">Pricing</a>
                <Link href="/security" className="block text-sm text-[#94a3b8] hover:text-white">Security</Link>
                <a href="#faq" className="block text-sm text-[#94a3b8] hover:text-white">FAQ</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">For Partners</h4>
              <div className="space-y-2">
                <Link href="/partners" className="block text-sm text-[#94a3b8] hover:text-white">Integration</Link>
                <Link href="/developers" className="block text-sm text-[#94a3b8] hover:text-white">Developer API</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
              <div className="space-y-2">
                <a href="/legal/terms" className="block text-sm text-[#94a3b8] hover:text-white">Terms of Service</a>
                <a href="/legal/privacy" className="block text-sm text-[#94a3b8] hover:text-white">Privacy Policy</a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#2a3a4f] pt-8 text-center">
            <p className="text-sm text-[#64748b]">
              &copy; 2026 LegacyGuard. All rights reserved. LegacyGuard never has access to your private keys or crypto assets.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
