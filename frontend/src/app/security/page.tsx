"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Key,
  Heart,
  CheckCircle,
  XCircle,
  Lock,
  FileText,
  Activity,
  Eye,
  AlertTriangle,
  Trash2,
  Loader2,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { createClient } from "@/lib/supabase/client";

const shardLocations = [
  {
    icon: Key,
    label: "Shard 1",
    location: "Your Device",
    color: "#22c55e",
    status: "Stored securely",
    desc: "Encrypted on your phone or computer",
  },
  {
    icon: Heart,
    label: "Shard 2",
    location: "Trusted Contact",
    color: "#3b82f6",
    status: "Distributed",
    desc: "Held by your designated heir",
  },
  {
    icon: Shield,
    label: "Shard 3",
    location: "LegacyGuard Vault",
    color: "#c9a84c",
    status: "Encrypted storage",
    desc: "We cannot read it",
  },
];

const canAccess = [
  "Your encrypted shard (1 of 3, useless alone)",
  "Your plan configuration and heir list",
  "Check-in timestamps",
  "Your account email address",
];

const cannotAccess = [
  "Your private keys or seed phrases",
  "Your crypto wallet balances",
  "Your complete encryption key",
  "Your funds in any way",
  "Your other shards",
];

const activityLog = [
  { action: "Security audit passed", time: "March 1, 2026", icon: Shield, color: "#22c55e" },
  { action: "Shard rotation completed", time: "February 15, 2026", icon: Key, color: "#c9a84c" },
  { action: "Heir identity verified", time: "February 1, 2026", icon: Eye, color: "#3b82f6" },
  { action: "Vault encryption upgraded", time: "January 20, 2026", icon: Lock, color: "#1a2332" },
  { action: "Account security review", time: "January 5, 2026", icon: Activity, color: "#f59e0b" },
];

export default function SecurityPage() {
  const score = 92;
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").delete().eq("id", user.id);
      }
      await supabase.auth.signOut();
      router.push("/");
    } catch {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1a2332]">Security & Trust</h1>
          <p className="text-[#64748b] mt-1">
            Understand how LegacyGuard protects your assets.
          </p>
        </div>

        {/* Security Score - Circular Gauge */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-8 text-center">
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="80" cy="80" r="68" fill="none"
                stroke={score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444"}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 68 * (score / 100)} ${2 * Math.PI * 68 * (1 - score / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-[#22c55e]">{score}</span>
              <span className="text-xs text-[#94a3b8] font-medium">out of 100</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-[#1a2332] mb-1">Excellent Protection</h2>
          <p className="text-sm text-[#64748b]">Your security configuration is strong</p>
        </div>

        {/* Shard Location Cards */}
        <h2 className="text-lg font-semibold text-[#1a2332] mb-4">Key Shard Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {shardLocations.map((shard) => (
            <div key={shard.label} className="bg-white rounded-2xl border border-[#e2e8f0] p-6 text-center hover:shadow-md transition-shadow">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${shard.color}15` }}
              >
                <shard.icon className="w-8 h-8" style={{ color: shard.color }} />
              </div>
              <div className="font-bold text-[#1a2332] mb-0.5">{shard.label}</div>
              <div className="text-sm font-semibold mb-2" style={{ color: shard.color }}>{shard.location}</div>
              <div className="text-xs text-[#64748b] mb-3">{shard.desc}</div>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: `${shard.color}15`, color: shard.color }}
              >
                {shard.status}
              </span>
            </div>
          ))}
        </div>

        {/* What We CAN and CANNOT Access */}
        <h2 className="text-lg font-semibold text-[#1a2332] mb-4">What LegacyGuard Can & Cannot Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-[#3b82f6]" />
              </div>
              <h3 className="font-semibold text-[#1a2332]">What We CAN Access</h3>
            </div>
            <ul className="flex flex-col gap-3">
              {canAccess.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                  <span className="text-[#64748b]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#ef4444]/10 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-[#ef4444]" />
              </div>
              <h3 className="font-semibold text-[#1a2332]">What We CANNOT Access</h3>
            </div>
            <ul className="flex flex-col gap-3">
              {cannotAccess.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <XCircle className="w-4 h-4 text-[#ef4444] mt-0.5 flex-shrink-0" />
                  <span className="text-[#64748b]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Encryption Details */}
        <h2 className="text-lg font-semibold text-[#1a2332] mb-4">Encryption Details</h2>
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1a2332] flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-[#c9a84c]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1a2332] mb-1">AES-256-GCM</h4>
                <p className="text-sm text-[#64748b]">
                  Military-grade symmetric encryption for vault data. The same standard used by governments worldwide.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1a2332] flex items-center justify-center flex-shrink-0">
                <Key className="w-5 h-5 text-[#c9a84c]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1a2332] mb-1">Shamir&apos;s Secret Sharing</h4>
                <p className="text-sm text-[#64748b]">
                  2-of-3 threshold scheme. Your key is split so no single party can reconstruct it alone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Last Audit */}
        <div className="bg-[#3b82f6]/5 rounded-2xl border border-[#3b82f6]/20 p-5 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-[#3b82f6]" />
            </div>
            <div>
              <p className="font-semibold text-[#1a2332]">Last Security Audit</p>
              <p className="text-sm text-[#64748b]">
                March 2026 by CertiK. All systems passed. Next audit scheduled for September 2026.
              </p>
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <h2 className="text-lg font-semibold text-[#1a2332] mb-4">Two-Factor Authentication</h2>
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-[#c9a84c]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-[#1a2332]">Two-Factor Authentication</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#c9a84c]/15 text-[#c9a84c]">
                  Coming Soon
                </span>
              </div>
              <p className="text-sm text-[#64748b]">
                Protect your account with an additional layer of security. 2FA will be available soon.
              </p>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <h2 className="text-lg font-semibold text-[#1a2332] mb-4">Security Activity</h2>
        <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-8">
          {activityLog.map((entry, i) => {
            const Icon = entry.icon;
            return (
              <div
                key={i}
                className={`flex items-center gap-4 px-6 py-4 ${
                  i < activityLog.length - 1 ? "border-b border-[#e2e8f0]" : ""
                }`}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${entry.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: entry.color }} />
                </div>
                <span className="text-sm text-[#1a2332] flex-1 font-medium">{entry.action}</span>
                <span className="text-xs text-[#94a3b8]">{entry.time}</span>
              </div>
            );
          })}
        </div>

        {/* Danger Zone */}
        <h2 className="text-lg font-semibold text-[#1a2332] mb-4">Danger Zone</h2>
        <div className="bg-white rounded-2xl border-2 border-[#ef4444] p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
            <h3 className="text-lg font-bold text-[#1a2332]">Delete Account</h3>
          </div>
          <p className="text-sm text-[#64748b] mb-5">
            This will permanently delete your account, all plans, heirs, and check-in history. This action cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ef4444] text-white rounded-xl text-sm font-semibold hover:bg-[#dc2626] transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete My Account
            </button>
          ) : (
            <div className="bg-[#ef4444]/5 rounded-xl border border-[#ef4444]/20 p-5">
              <p className="text-sm font-semibold text-[#ef4444] mb-4">
                Are you absolutely sure? This will permanently delete all your data.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ef4444] text-white rounded-xl text-sm font-semibold hover:bg-[#dc2626] transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {deleting ? "Deleting..." : "Yes, Delete Everything"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-5 py-2.5 bg-[#f8fafc] text-[#1a2332] border border-[#e2e8f0] rounded-xl text-sm font-semibold hover:bg-[#e2e8f0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
