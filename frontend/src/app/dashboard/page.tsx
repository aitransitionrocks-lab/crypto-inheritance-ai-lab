"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  FileText,
  Clock,
  CheckCircle,
  Users,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Plus,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { usePlans, useVaults, useCheckins } from "@/hooks/useSupabase";
import type { InheritancePlan } from "@/lib/supabase/types";
import { trackEvent } from "@/lib/analytics";

function getDaysSince(dateStr: string): number {
  const now = new Date();
  const then = new Date(dateStr);
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

function formatTimeAgo(dateStr: string): string {
  const days = getDaysSince(dateStr);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? "s" : ""} ago`;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { plans, loading: plansLoading } = usePlans();
  const { vaults, loading: vaultsLoading } = useVaults();
  const { checkins, loading: checkinsLoading } = useCheckins();
  const [heirCounts, setHeirCounts] = useState<Record<string, number>>({});

  const isLoading = authLoading || plansLoading || vaultsLoading || checkinsLoading;

  // Fetch heir counts for each plan
  useEffect(() => {
    if (plans.length === 0) return;
    const fetchCounts = async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const counts: Record<string, number> = {};
      for (const plan of plans) {
        const { count } = await supabase
          .from("heirs")
          .select("*", { count: "exact", head: true })
          .eq("plan_id", plan.id);
        counts[plan.id] = count ?? 0;
      }
      setHeirCounts(counts);
    };
    fetchCounts();
  }, [plans]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signup");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    trackEvent("page_view", { page: "/dashboard" });
  }, []);

  // Compute metrics
  const lastCheckIn = checkins.length > 0 ? checkins[0] : null;
  const activePlans = plans.filter((p) => p.status === "active" || p.status === "warning");

  // Find earliest next check-in due across all plans
  let nextCheckInDays: number | null = null;
  if (lastCheckIn && plans.length > 0) {
    const minTrigger = Math.min(...plans.map((p) => p.trigger_interval_days));
    const daysSinceLast = getDaysSince(lastCheckIn.created_at);
    nextCheckInDays = Math.max(0, minTrigger - daysSinceLast);
  }

  // Find plans that need attention
  const warningPlan = plans.find((p) => {
    if (!lastCheckIn) return false;
    const daysSince = getDaysSince(lastCheckIn.created_at);
    return daysSince > p.trigger_interval_days * 0.7;
  });

  function getPlanStatus(plan: InheritancePlan): "active" | "warning" {
    if (!lastCheckIn) return "active";
    const daysSince = getDaysSince(lastCheckIn.created_at);
    return daysSince > plan.trigger_interval_days * 0.7 ? "warning" : "active";
  }

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a2332]" />
        </div>
      </AppLayout>
    );
  }

  // Empty state
  if (!isLoading && plans.length === 0) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#c9a84c]/10 mb-6">
            <Shield className="w-10 h-10 text-[#c9a84c]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a2332] mb-3">
            Welcome to LegacyGuard
          </h1>
          <p className="text-[#64748b] text-lg mb-8 max-w-md mx-auto">
            You haven&apos;t set up an inheritance plan yet. Get started in just 5 minutes to protect your crypto legacy.
          </p>
          <Link
            href="/setup/vault"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a2332] text-white rounded-xl text-lg font-semibold hover:bg-[#2a3a4f] hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Set Up Your First Plan
          </Link>
        </div>
      </AppLayout>
    );
  }

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
        {warningPlan && (
          <div className="mb-6 p-4 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-2xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#f59e0b] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1a2332]">Check-in Reminder</p>
              <p className="text-sm text-[#64748b]">
                Your &quot;{warningPlan.plan_name}&quot; plan check-in is overdue. Please check in to keep your plan active.
              </p>
            </div>
            <Link
              href="/checkin"
              className="px-4 py-2 bg-[#f59e0b] text-white rounded-lg text-sm font-semibold hover:bg-[#d97706] transition-colors flex-shrink-0"
            >
              Check In
            </Link>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Security Score */}
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
                {plansLoading ? (
                  <div className="h-9 w-12 bg-[#e2e8f0] animate-pulse rounded" />
                ) : (
                  <p className="text-3xl font-bold text-[#1a2332]">{activePlans.length}</p>
                )}
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
                {checkinsLoading ? (
                  <div className="h-9 w-20 bg-[#e2e8f0] animate-pulse rounded" />
                ) : nextCheckInDays !== null ? (
                  <p className="text-3xl font-bold text-[#1a2332]">{nextCheckInDays} <span className="text-lg font-medium text-[#64748b]">days</span></p>
                ) : (
                  <p className="text-lg font-bold text-[#f59e0b]">Check in now</p>
                )}
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
          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#e2e8f0] p-6 animate-pulse">
                  <div className="h-5 w-48 bg-[#e2e8f0] rounded mb-4" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-10 bg-[#e2e8f0] rounded" />
                    <div className="h-10 bg-[#e2e8f0] rounded" />
                    <div className="h-10 bg-[#e2e8f0] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {plans.map((plan) => {
                const status = getPlanStatus(plan);
                return (
                  <div
                    key={plan.id}
                    className="bg-white rounded-2xl border border-[#e2e8f0] p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-[#1a2332] text-lg">{plan.plan_name}</h3>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          status === "active"
                            ? "bg-[#22c55e]/10 text-[#22c55e]"
                            : "bg-[#f59e0b]/10 text-[#f59e0b]"
                        }`}
                      >
                        {status === "active" ? "Active" : "Needs Attention"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-[#94a3b8] text-xs">Heirs</p>
                        <p className="font-semibold text-[#1a2332] flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#3b82f6]" /> {heirCounts[plan.id] ?? 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#94a3b8] text-xs">Last Check-in</p>
                        <p className="font-semibold text-[#1a2332]">
                          {lastCheckIn ? formatTimeAgo(lastCheckIn.created_at) : "Never"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#94a3b8] text-xs">Trigger</p>
                        <p className="font-semibold text-[#1a2332]">{plan.trigger_interval_days}d</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold text-[#1a2332] mb-4">Recent Check-ins</h2>
          {checkinsLoading ? (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 animate-pulse">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-[#e2e8f0] rounded" />
                ))}
              </div>
            </div>
          ) : checkins.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 text-center">
              <p className="text-[#64748b]">No check-ins yet. Complete your first check-in to keep your plan active.</p>
              <Link
                href="/checkin"
                className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[#c9a84c] hover:text-[#b8973f]"
              >
                Check In Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
              {checkins.slice(0, 5).map((ci, i) => (
                <div
                  key={ci.id}
                  className={`flex items-center gap-4 px-6 py-4 ${
                    i < Math.min(checkins.length, 5) - 1 ? "border-b border-[#e2e8f0]" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#22c55e]/10">
                    <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                  </div>
                  <span className="text-sm text-[#1a2332] flex-1 font-medium">Check-in completed</span>
                  <span className="text-xs text-[#94a3b8]">
                    {new Date(ci.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
