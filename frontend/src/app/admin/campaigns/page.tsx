"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  Mail,
  Clock,
  ArrowRight,
} from "lucide-react";

const emailSequences = [
  {
    day: 1,
    subject: "Welcome to LegacyGuard — here's how to get started",
    description:
      "Onboarding email with quick-start guide, vault creation CTA, and links to documentation.",
  },
  {
    day: 3,
    subject: "Did you complete your vault setup?",
    description:
      "Reminder for users who signed up but haven't created a vault. Includes step-by-step walkthrough.",
  },
  {
    day: 7,
    subject: "Your first check-in is coming up",
    description:
      "Explains the check-in process, how the dead man's switch works, and what happens if missed.",
  },
  {
    day: 14,
    subject: "Upgrade to Pro for advanced security",
    description:
      "Highlights Pro features: unlimited vaults, SMS check-in, custom trigger intervals, multi-chain support.",
  },
  {
    day: 30,
    subject: "How's your inheritance plan working?",
    description:
      "Re-engagement email with satisfaction survey, feature updates, and referral program invitation.",
  },
];

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0]">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-[#c9a84c]" />
          <span className="text-xl font-bold text-[#1a2332]">LegacyGuard</span>
        </Link>
        <span className="text-sm font-medium text-[#64748b]">Admin &middot; Email Campaigns</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1a2332]">Email Drip Campaigns</h1>
          <p className="text-[#64748b] mt-1">
            Planned email sequences for user onboarding and engagement.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-[#3b82f6]/5 border border-[#3b82f6]/20 rounded-2xl p-5 mb-8 flex items-start gap-3">
          <Mail className="w-5 h-5 text-[#3b82f6] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#1a2332]">
              Email automation will be configured via Resend.com
            </p>
            <p className="text-sm text-[#64748b] mt-1">
              These sequences are planned and will be activated once the email
              provider integration is complete.
            </p>
          </div>
        </div>

        {/* Sequence List */}
        <div className="flex flex-col gap-4">
          {emailSequences.map((seq) => (
            <div
              key={seq.day}
              className="bg-white rounded-2xl border border-[#e2e8f0] p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#c9a84c]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#64748b]">
                      Day {seq.day}
                    </span>
                    <h3 className="text-sm font-bold text-[#1a2332]">
                      {seq.subject}
                    </h3>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] text-xs font-bold">
                  Planned
                </span>
              </div>
              <p className="text-sm text-[#64748b] leading-relaxed pl-[52px]">
                {seq.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-10 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#1a2332] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
