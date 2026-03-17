"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  CheckCircle,
  Clock,
  Loader2,
  CalendarCheck,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { useCheckins, usePlans } from "@/hooks/useSupabase";
import { createClient } from "@/lib/supabase/client";

export default function CheckInPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { checkins, loading: checkinsLoading, refetch: refetchCheckins } = useCheckins();
  const { plans, loading: plansLoading } = usePlans();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signup");
    }
  }, [authLoading, user, router]);

  const lastCheckIn = checkins.length > 0 ? checkins[0] : null;
  const minTriggerDays = plans.length > 0 ? Math.min(...plans.map((p) => p.trigger_days)) : 90;

  function getNextDueDate(): string {
    const base = success ? new Date() : lastCheckIn ? new Date(lastCheckIn.checked_in_at) : new Date();
    const next = new Date(base);
    next.setDate(next.getDate() + minTriggerDays);
    return next.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  function getDaysUntilDue(): number {
    const base = success ? new Date() : lastCheckIn ? new Date(lastCheckIn.checked_in_at) : new Date();
    const next = new Date(base);
    next.setDate(next.getDate() + minTriggerDays);
    return Math.max(0, Math.ceil((next.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  }

  async function handleCheckIn() {
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: dbError } = await supabase
        .from("check_ins")
        .insert({
          user_id: user!.id,
          plan_id: plans.length > 0 ? plans[0].id : null,
          checked_in_at: new Date().toISOString(),
        });
      if (dbError) throw dbError;
      setSuccess(true);
      refetchCheckins();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Check-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || checkinsLoading || plansLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a2332]" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1a2332]">Check In</h1>
          <p className="text-[#64748b] mt-1">
            Confirm your presence to keep your plan active.
          </p>
        </div>

        {/* Main Check-in Card */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 md:p-12 mb-6 text-center">
          {success ? (
            <div className="py-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#22c55e]/10 mb-6">
                <CheckCircle className="w-14 h-14 text-[#22c55e]" />
              </div>
              <h2 className="text-2xl font-bold text-[#22c55e] mb-2">
                Check-in Recorded
              </h2>
              <p className="text-[#64748b] text-lg">
                Your plan is active. Your heirs are safe.
              </p>
              <div className="mt-6 p-4 bg-[#22c55e]/5 rounded-xl border border-[#22c55e]/20">
                <p className="text-sm text-[#22c55e] font-semibold">
                  Next check-in due: {getNextDueDate()}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#1a2332]/5 mb-6">
                <Shield className="w-14 h-14 text-[#1a2332]" />
              </div>
              <h2 className="text-xl font-bold text-[#1a2332] mb-6">
                Confirm You&apos;re Still Here
              </h2>
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="px-12 py-5 bg-[#1a2332] text-white rounded-2xl text-xl font-bold hover:bg-[#2a3a4f] hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Checking In...
                  </span>
                ) : (
                  "I'm Still Here"
                )}
              </button>
              {error && (
                <div className="mt-6 p-3 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-xl text-sm text-[#ef4444]">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Last & Next Check-in */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#3b82f6]" />
              </div>
              <div>
                <p className="text-xs text-[#94a3b8] font-medium">Last Check-in</p>
                <p className="text-sm font-bold text-[#1a2332]">
                  {success
                    ? "Just now"
                    : lastCheckIn
                      ? new Date(lastCheckIn.checked_in_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Never"}
                </p>
                <p className="text-xs text-[#64748b]">
                  {!success && lastCheckIn
                    ? new Date(lastCheckIn.checked_in_at).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : ""}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-[#c9a84c]" />
              </div>
              <div>
                <p className="text-xs text-[#94a3b8] font-medium">Next Due</p>
                <p className="text-sm font-bold text-[#1a2332]">
                  {getNextDueDate()}
                </p>
                <p className="text-xs text-[#64748b]">
                  {getDaysUntilDue()} days left
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div>
          <h2 className="text-lg font-semibold text-[#1a2332] mb-4">Check-in History</h2>
          {checkins.length === 0 && !success ? (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 text-center">
              <p className="text-[#64748b]">No check-ins yet. Complete your first check-in above.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
              {checkins.slice(0, 10).map((ci, i) => (
                <div
                  key={ci.id}
                  className={`flex items-center gap-4 px-5 py-4 ${
                    i < Math.min(checkins.length, 10) - 1 ? "border-b border-[#e2e8f0]" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1a2332]">
                      {new Date(ci.checked_in_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(ci.checked_in_at).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#22c55e] bg-[#22c55e]/10 px-2.5 py-1 rounded-full">
                    Completed
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
