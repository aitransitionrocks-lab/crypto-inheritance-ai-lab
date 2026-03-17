"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle,
  Shield,
  Users,
  Clock,
  ArrowRight,
  UserPlus,
} from "lucide-react";

const setupSteps = [
  { label: "Vault Setup", step: 1 },
  { label: "Create Plan", step: 2 },
  { label: "Complete", step: 3 },
];

export default function SetupCompletePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps - All Complete */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {setupSteps.map((s, i) => (
            <React.Fragment key={s.step}>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-[#22c55e] text-white">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-[#22c55e]">
                  {s.label}
                </span>
              </div>
              {i < setupSteps.length - 1 && (
                <div className="w-20 h-0.5 mx-2 mb-6 bg-[#22c55e]" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Success Message */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#22c55e]/10 mb-6">
            <CheckCircle className="w-14 h-14 text-[#22c55e]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1a2332] mb-3">
            Your Legacy is Protected
          </h1>
          <p className="text-lg text-[#64748b] max-w-md mx-auto">
            Your crypto inheritance plan is now active. Your assets are safe and your heirs are prepared.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 text-center hover:shadow-md transition-shadow">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#c9a84c15" }}
            >
              <Shield className="w-7 h-7 text-[#c9a84c]" />
            </div>
            <h3 className="font-bold text-[#1a2332] mb-1">Vault Secured</h3>
            <p className="text-sm text-[#64748b]">My Main Vault</p>
            <p className="text-xs text-[#94a3b8] mt-1">Key split into 3 shards</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 text-center hover:shadow-md transition-shadow">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#3b82f615" }}
            >
              <Users className="w-7 h-7 text-[#3b82f6]" />
            </div>
            <h3 className="font-bold text-[#1a2332] mb-1">Heirs Assigned</h3>
            <p className="text-sm text-[#64748b]">1 heir designated</p>
            <p className="text-xs text-[#94a3b8] mt-1">Will be notified when triggered</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 text-center hover:shadow-md transition-shadow">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#22c55e15" }}
            >
              <Clock className="w-7 h-7 text-[#22c55e]" />
            </div>
            <h3 className="font-bold text-[#1a2332] mb-1">Trigger Active</h3>
            <p className="text-sm text-[#64748b]">90-day check-in</p>
            <p className="text-xs text-[#94a3b8] mt-1">Check-in schedule is running</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-[#1a2332] text-white rounded-xl text-lg font-semibold hover:bg-[#2a3a4f] hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/setup/plan"
            className="w-full sm:w-auto px-8 py-4 border-2 border-[#e2e8f0] text-[#1a2332] rounded-xl text-lg font-semibold hover:bg-[#f8fafc] transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Invite Another Heir
          </Link>
        </div>

        {/* Trust footer */}
        <div className="mt-10 p-4 bg-[#22c55e]/5 rounded-2xl border border-[#22c55e]/20 text-center">
          <p className="text-sm text-[#22c55e] font-semibold flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            LegacyGuard is non-custodial. We never have access to your assets.
          </p>
        </div>
      </div>
    </div>
  );
}
