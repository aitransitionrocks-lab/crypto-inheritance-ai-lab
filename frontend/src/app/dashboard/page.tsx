"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  FileText,
  Clock,
  CheckCircle,
  Activity,
  Users,
  AlertTriangle,
  ArrowRight,
  Bell,
  Key,
  UserPlus,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const plans = [
  {
    name: "Family Legacy Plan",
    status: "active",
    heirs: 3,
    lastCheckIn: "2 hours ago",
    triggerDays: 90,
    nextCheckIn: "28 days",
  },
  {
    name: "Business Backup",
    status: "warning",
    heirs: 1,
    lastCheckIn: "75 days ago",
    triggerDays: 90,
    nextCheckIn: "15 days",
  },
];

const activityLog = [
  { action: "Check-in completed", time: "2 hours ago", icon: CheckCircle, color: "#22c55e" },
  { action: "Heir added: Alice Smith", time: "3 days ago", icon: UserPlus, color: "#3b82f6" },
  { action: "Plan created: Family Legacy Plan", time: "1 week ago", icon: FileText, color: "#c9a84c" },
  { action: "Vault secured with 3 shards", time: "1 week ago", icon: Key, color: "#c9a84c" },
  { action: "Account created", time: "1 week ago", icon: Shield, color: "#1a2332" },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1a2332]">Dashboard</h1>
            <p className="text-[#64748b] mt-1">Welcome back. Your legacy is protected.</p>
          </div>
          <Link
            href="/checkin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-white rounded-xl font-semibold hover:bg-[#b8973f] hover:shadow-lg transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            Check In Now
          </Link>
        </div>

        {/* Security Alert Banner */}
        <div className="mb-6 p-4 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-2xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#f59e0b] flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#1a2332]">Check-in Reminder</p>
            <p className="text-sm text-[#64748b]">
              Your &quot;Business Backup&quot; plan check-in is overdue by 75 days. Please check in to keep your plan active.
            </p>
          </div>
          <Link
            href="/checkin"
            className="px-4 py-2 bg-[#f59e0b] text-white rounded-lg text-sm font-semibold hover:bg-[#d97706] transition-colors flex-shrink-0"
          >
            Check In
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Security Score - Circular */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-5">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                  <circle
                    cx="32" cy="32" r="28" fill="none" stroke="#22c55e" strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 28 * 0.92} ${2 * Math.PI * 28 * 0.08}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#22c55e]">92</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#64748b]">Security Score</p>
                <p className="text-xl font-bold text-[#1a2332]">Excellent</p>
              </div>
            </div>
          </div>

          {/* Active Plans */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#3b82f6]/10 flex items-center justify-center">
                <FileText className="w-7 h-7 text-[#3b82f6]" />
              </div>
              <div>
                <p className="text-sm text-[#64748b]">Active Plans</p>
                <p className="text-3xl font-bold text-[#1a2332]">2</p>
              </div>
            </div>
          </div>

          {/* Next Check-in */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#f59e0b]/10 flex items-center justify-center">
                <Clock className="w-7 h-7 text-[#f59e0b]" />
              </div>
              <div>
                <p className="text-sm text-[#64748b]">Next Check-in</p>
                <p className="text-3xl font-bold text-[#1a2332]">15 <span className="text-lg font-medium text-[#64748b]">days</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1a2332]">Your Plans</h2>
            <Link href="/setup/plan" className="text-sm font-medium text-[#c9a84c] hover:text-[#b8973f] transition-colors">
              + New Plan
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="bg-white rounded-2xl border border-[#e2e8f0] p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#1a2332] text-lg">{plan.name}</h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      plan.status === "active"
                        ? "bg-[#22c55e]/10 text-[#22c55e]"
                        : "bg-[#f59e0b]/10 text-[#f59e0b]"
                    }`}
                  >
                    {plan.status === "active" ? "Active" : "Needs Attention"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-[#94a3b8] text-xs">Heirs</p>
                    <p className="font-semibold text-[#1a2332] flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#3b82f6]" /> {plan.heirs}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#94a3b8] text-xs">Last Check-in</p>
                    <p className="font-semibold text-[#1a2332]">{plan.lastCheckIn}</p>
                  </div>
                  <div>
                    <p className="text-[#94a3b8] text-xs">Trigger</p>
                    <p className="font-semibold text-[#1a2332]">{plan.triggerDays}d</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold text-[#1a2332] mb-4">Recent Activity</h2>
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
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
        </div>
      </div>
    </AppLayout>
  );
}
