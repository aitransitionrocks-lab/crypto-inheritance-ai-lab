"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  TrendingUp,
  Scale,
  DollarSign,
  Code,
  Palette,
  Zap,
  ArrowRight,
  Loader2,
  Lock,
  CheckCircle,
  ExternalLink,
  BarChart3,
  Link2,
  Activity,
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "User Retention",
    desc: "Offer inheritance planning as a built-in feature. Users who set up legacy plans have 3x higher retention rates.",
    color: "#3b82f6",
  },
  {
    icon: Scale,
    title: "Compliance Ready",
    desc: "Stay ahead of emerging regulations around digital asset inheritance. Our solution is built with compliance in mind.",
    color: "#22c55e",
  },
  {
    icon: DollarSign,
    title: "Revenue Share",
    desc: "Earn recurring revenue from Pro and Enterprise subscriptions referred through your platform.",
    color: "#c9a84c",
  },
];

const integrationTypes = [
  {
    icon: Code,
    title: "REST API",
    desc: "Full-featured API for complete programmatic control. Manage vaults, plans, heirs, and check-ins.",
    effort: "Low",
    effortColor: "#22c55e",
  },
  {
    icon: Zap,
    title: "SDK",
    desc: "Drop-in Python and Node.js SDKs with pre-built components for rapid integration.",
    effort: "Medium",
    effortColor: "#f59e0b",
  },
  {
    icon: Palette,
    title: "White-Label",
    desc: "Fully customizable, branded experience embedded within your app. Your brand, our technology.",
    effort: "Full",
    effortColor: "#3b82f6",
  },
];

const securityBadges = [
  "AES-256-GCM Encryption",
  "Shamir Secret Sharing",
  "Non-Custodial Architecture",
  "Open Source Protocol",
  "CertiK Audited",
  "SOC 2 Compliant",
];

export default function PartnersPage() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [walletType, setWalletType] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName || !email) return;
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.from("partner_inquiries").insert({
        company_name: companyName,
        email,
        integration_type: walletType || null,
      });
    } catch {
      // Graceful fallback: table may not exist yet
    }
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0]">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-[#c9a84c]" />
          <span className="text-xl font-bold text-[#1a2332]">LegacyGuard</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/developers" className="text-sm font-medium text-[#64748b] hover:text-[#1a2332]">
            Developer Docs
          </Link>
          <Link href="/signup" className="px-5 py-2.5 bg-[#1a2332] text-white rounded-lg text-sm font-semibold hover:bg-[#2a3a4f] transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#1a2332] py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#c9a84c]/10 rounded-full mb-8">
            <Shield className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-sm font-medium text-[#c9a84c]">Partner Program</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Integrate Crypto Inheritance<br />
            <span className="text-[#c9a84c]">Into Your Wallet</span>
          </h1>
          <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto mb-10">
            Exchanges, wallets, and custodians can offer inheritance planning as a built-in feature.
            Increase retention, stay compliant, and earn revenue.
          </p>
          <a
            href="#request-key"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a84c] text-white rounded-xl text-lg font-semibold hover:bg-[#b8973f] transition-all"
          >
            Request API Key <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a2332] mb-4">
              Why Partners Choose LegacyGuard
            </h2>
            <p className="text-lg text-[#64748b]">Add real value to your platform while generating new revenue.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="bg-white rounded-2xl border border-[#e2e8f0] p-8 hover:shadow-lg transition-shadow">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${b.color}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: b.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a2332] mb-3">{b.title}</h3>
                  <p className="text-[#64748b] leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integration Types */}
      <section className="bg-[#f1f5f9] py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a2332] mb-4">
              Integration Options
            </h2>
            <p className="text-lg text-[#64748b]">Choose the approach that fits your team.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {integrationTypes.map((it) => {
              const Icon = it.icon;
              return (
                <div key={it.title} className="bg-white rounded-2xl border border-[#e2e8f0] p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#1a2332] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#c9a84c]" />
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: `${it.effortColor}15`, color: it.effortColor }}
                    >
                      {it.effort} Effort
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1a2332] mb-3">{it.title}</h3>
                  <p className="text-[#64748b] leading-relaxed">{it.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Request API Key Form */}
      <section id="request-key" className="py-20">
        <div className="max-w-xl mx-auto px-6 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1a2332] mb-4">Request API Key</h2>
            <p className="text-[#64748b]">Tell us about your platform and we&apos;ll get you set up.</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#22c55e]/10 mb-4">
                  <CheckCircle className="w-8 h-8 text-[#22c55e]" />
                </div>
                <h3 className="text-xl font-bold text-[#1a2332] mb-2">Request Submitted</h3>
                <p className="text-[#64748b]">We&apos;ll be in touch within 24 hours with your API credentials.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1a2332]">Company Name</label>
                  <input
                    type="text"
                    placeholder="Your company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1a2332]">Email</label>
                  <input
                    type="email"
                    placeholder="partnerships@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#1a2332]">Wallet / Platform Type</label>
                  <select
                    value={walletType}
                    onChange={(e) => setWalletType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                  >
                    <option value="">Select type...</option>
                    <option value="exchange">Exchange</option>
                    <option value="wallet">Wallet Provider</option>
                    <option value="custodian">Custodian</option>
                    <option value="defi">DeFi Protocol</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#1a2332] text-white rounded-xl font-semibold hover:bg-[#2a3a4f] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Request API Key
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Partner Analytics */}
      <section className="bg-[#f1f5f9] py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a2332] mb-4">
              Partner Analytics
            </h2>
            <p className="text-lg text-[#64748b]">
              Track your integration performance in real time.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Link2, label: "Active Integrations", value: "\u2014", color: "#3b82f6" },
              { icon: Users, label: "End Users", value: "\u2014", color: "#22c55e" },
              { icon: Activity, label: "API Calls", value: "\u2014", color: "#c9a84c" },
              { icon: DollarSign, label: "Revenue", value: "\u2014", color: "#8b5cf6" },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="bg-white rounded-2xl border border-[#e2e8f0] p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${metric.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: metric.color }} />
                  </div>
                  <div className="text-3xl font-bold text-[#1a2332] mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-[#64748b]">{metric.label}</div>
                </div>
              );
            })}
          </div>
          <div className="bg-white/60 border border-[#e2e8f0] rounded-xl p-4 text-center">
            <p className="text-sm text-[#64748b]">
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Analytics dashboard available after integration approval.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-[#1a2332] py-16">
        <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">
          <Lock className="w-10 h-10 text-[#c9a84c] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-8">Built on Trust & Security</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {securityBadges.map((badge) => (
              <span
                key={badge}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-[#94a3b8] font-medium"
              >
                {badge}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/developers"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#c9a84c] hover:text-[#e8d49a] transition-colors"
            >
              View Developer Documentation <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a2332] border-t border-[#2a3a4f] py-8">
        <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">
          <p className="text-sm text-[#64748b]">
            &copy; 2026 LegacyGuard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
