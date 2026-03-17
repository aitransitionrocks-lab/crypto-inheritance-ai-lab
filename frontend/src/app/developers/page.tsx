"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Code,
  Terminal,
  Key,
  ArrowRight,
  Loader2,
  CheckCircle,
  Lock,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

const endpoints = [
  { method: "POST", path: "/api/users/register", description: "Register a new user" },
  { method: "POST", path: "/api/users/login", description: "Authenticate and get token" },
  { method: "GET", path: "/api/plans", description: "List all plans" },
  { method: "POST", path: "/api/plans", description: "Create a new plan" },
  { method: "GET", path: "/api/plans/:id", description: "Get plan details" },
  { method: "PUT", path: "/api/plans/:id", description: "Update a plan" },
  { method: "DELETE", path: "/api/plans/:id", description: "Delete a plan" },
  { method: "POST", path: "/api/plans/:id/heirs", description: "Add heir to plan" },
  { method: "POST", path: "/api/checkins", description: "Perform check-in" },
  { method: "POST", path: "/api/vaults", description: "Create a vault" },
  { method: "GET", path: "/api/vaults/:id", description: "Get vault details" },
];

const methodColors: Record<string, { bg: string; text: string }> = {
  GET: { bg: "bg-[#22c55e]/10", text: "text-[#22c55e]" },
  POST: { bg: "bg-[#3b82f6]/10", text: "text-[#3b82f6]" },
  PUT: { bg: "bg-[#f59e0b]/10", text: "text-[#f59e0b]" },
  DELETE: { bg: "bg-[#ef4444]/10", text: "text-[#ef4444]" },
};

const curlExample = `curl -X POST https://api.legacyguard.io/api/plans \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Family Legacy Plan",
    "trigger_days": 90,
    "check_in_method": "email"
  }'`;

const responseExample = `{
  "id": "plan_abc123",
  "name": "Family Legacy Plan",
  "trigger_days": 90,
  "check_in_method": "email",
  "status": "active",
  "created_at": "2026-03-17T10:30:00Z"
}`;

const sdks = [
  { name: "Python", install: "pip install legacyguard", color: "#3b82f6" },
  { name: "Node.js", install: "npm install @legacyguard/sdk", color: "#22c55e" },
];

export default function DevelopersPage() {
  const [apiEmail, setApiEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function handleGetKey(e: React.FormEvent) {
    e.preventDefault();
    if (!apiEmail) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  }

  function copyToClipboard(text: string, index: number) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
          <Link href="/partners" className="text-sm font-medium text-[#64748b] hover:text-[#1a2332]">
            Partners
          </Link>
          <Link href="/signup" className="px-5 py-2.5 bg-[#1a2332] text-white rounded-lg text-sm font-semibold hover:bg-[#2a3a4f] transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 border-b border-[#e2e8f0]">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#c9a84c]/10 rounded-full mb-6">
            <Code className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-sm font-medium text-[#c9a84c]">Developer Portal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a2332] mb-4">
            LegacyGuard API Documentation
          </h1>
          <p className="text-lg text-[#64748b] max-w-2xl">
            Integrate crypto inheritance planning into your application with our RESTful API. Manage vaults, plans, heirs, and check-ins programmatically.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1a2332] mb-6 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-[#c9a84c]" />
            Quick Start
          </h2>
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-4">
            <div className="flex items-center justify-between px-5 py-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
              <span className="text-sm font-medium text-[#64748b]">Create a Plan</span>
              <button
                onClick={() => copyToClipboard(curlExample, 0)}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#64748b] hover:text-[#1a2332] transition-colors cursor-pointer"
              >
                {copiedIndex === 0 ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 0 ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-[#1a2332] p-6 overflow-x-auto">
              <pre className="text-sm font-mono text-[#22c55e] whitespace-pre">{curlExample}</pre>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
              <span className="text-sm font-medium text-[#64748b]">Response</span>
              <button
                onClick={() => copyToClipboard(responseExample, 1)}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#64748b] hover:text-[#1a2332] transition-colors cursor-pointer"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 1 ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-[#1a2332] p-6 overflow-x-auto">
              <pre className="text-sm font-mono text-[#c9a84c] whitespace-pre">{responseExample}</pre>
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1a2332] mb-6 flex items-center gap-2">
            <Key className="w-6 h-6 text-[#c9a84c]" />
            Authentication
          </h2>
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
            <p className="text-[#64748b] mb-4">
              All API requests require a Bearer token in the Authorization header.
              Get your API key by registering an account or requesting partner access.
            </p>
            <div className="bg-[#1a2332] rounded-xl p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-[#94a3b8]">
                <span className="text-[#64748b]">Authorization:</span>{" "}
                <span className="text-[#c9a84c]">Bearer YOUR_API_KEY</span>
              </pre>
            </div>
            <div className="mt-4 p-3 bg-[#f59e0b]/5 rounded-xl border border-[#f59e0b]/20">
              <p className="text-sm text-[#64748b]">
                <span className="font-semibold text-[#f59e0b]">Note:</span> Keep your API key secret. Never expose it in client-side code.
              </p>
            </div>
          </div>
        </section>

        {/* API Endpoint Reference */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1a2332] mb-6 flex items-center gap-2">
            <Code className="w-6 h-6 text-[#c9a84c]" />
            API Endpoints
          </h2>
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wider">Method</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wider">Endpoint</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoints.map((ep, i) => {
                    const colors = methodColors[ep.method] || { bg: "bg-[#e2e8f0]", text: "text-[#64748b]" };
                    return (
                      <tr key={`${ep.method}-${ep.path}`} className={i < endpoints.length - 1 ? "border-b border-[#e2e8f0]" : ""}>
                        <td className="px-6 py-3">
                          <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${colors.bg} ${colors.text}`}>
                            {ep.method}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <code className="text-sm font-mono text-[#1a2332]">{ep.path}</code>
                        </td>
                        <td className="px-6 py-3 text-sm text-[#64748b]">{ep.description}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SDK Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1a2332] mb-6">SDKs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sdks.map((sdk) => (
              <div key={sdk.name} className="bg-white rounded-2xl border border-[#e2e8f0] p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${sdk.color}15` }}
                  >
                    <Code className="w-5 h-5" style={{ color: sdk.color }} />
                  </div>
                  <h3 className="font-bold text-[#1a2332] text-lg">{sdk.name}</h3>
                </div>
                <div className="bg-[#1a2332] rounded-lg p-3 mb-4">
                  <code className="text-sm font-mono text-[#22c55e]">{sdk.install}</code>
                </div>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  style={{ color: sdk.color }}
                >
                  View Documentation <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Sandbox */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1a2332] mb-6 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-[#c9a84c]" />
            Sandbox
          </h2>
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
            <p className="text-[#64748b] mb-4">
              Test your integration in our sandbox environment. Use API key prefix{" "}
              <code className="px-2 py-0.5 bg-[#f8fafc] rounded text-sm font-mono text-[#1a2332] border border-[#e2e8f0]">
                lg_test_
              </code>{" "}
              for sandbox mode. All sandbox data is reset daily.
            </p>
            <div className="mt-4 p-3 bg-[#22c55e]/5 rounded-xl border border-[#22c55e]/20">
              <p className="text-sm text-[#64748b]">
                <span className="font-semibold text-[#22c55e]">Tip:</span> Sandbox requests behave identically to production but never affect real data.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a2332] text-white rounded-xl font-semibold hover:bg-[#2a3a4f] transition-colors"
              >
                Get Sandbox Key <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Get API Key CTA */}
        <section>
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8">
            <div className="text-center mb-6">
              <Lock className="w-8 h-8 text-[#c9a84c] mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-[#1a2332] mb-2">Get Your API Key</h2>
              <p className="text-[#64748b]">Start building with LegacyGuard today.</p>
            </div>

            {submitted ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#22c55e]/10 mb-3">
                  <CheckCircle className="w-7 h-7 text-[#22c55e]" />
                </div>
                <h3 className="text-lg font-bold text-[#1a2332] mb-1">Request Submitted</h3>
                <p className="text-sm text-[#64748b]">Check your email for your API key and documentation.</p>
              </div>
            ) : (
              <form onSubmit={handleGetKey} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="developer@example.com"
                  value={apiEmail}
                  onChange={(e) => setApiEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#1a2332] text-white rounded-xl font-semibold hover:bg-[#2a3a4f] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer whitespace-nowrap"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Get API Key <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a2332] py-8 mt-12">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="text-sm text-[#64748b]">
            &copy; 2026 LegacyGuard. All rights reserved. Contact{" "}
            <span className="text-[#94a3b8]">developers@legacyguard.io</span> for support.
          </p>
        </div>
      </footer>
    </div>
  );
}
