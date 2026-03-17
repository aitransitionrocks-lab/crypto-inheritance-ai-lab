"use client";

import React, { useState } from "react";
import {
  Shield,
  CheckCircle,
  Clock,
  Loader2,
  CalendarCheck,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { apiPost } from "@/services/api";

const pastCheckIns = [
  { date: "March 15, 2026 at 2:30 PM", status: "Completed" },
  { date: "February 14, 2026 at 10:15 AM", status: "Completed" },
  { date: "January 12, 2026 at 4:45 PM", status: "Completed" },
  { date: "December 10, 2025 at 9:00 AM", status: "Completed" },
  { date: "November 8, 2025 at 1:20 PM", status: "Completed" },
];

export default function CheckInPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckIn() {
    setLoading(true);
    setError("");
    try {
      await apiPost("/api/checkins");
      setSuccess(true);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Check-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
                  Next check-in due: June 15, 2026
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
                  {success ? "Just now" : "March 15, 2026"}
                </p>
                <p className="text-xs text-[#64748b]">
                  {success ? "" : "2:30 PM"}
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
                  {success ? "June 15, 2026" : "June 13, 2026"}
                </p>
                <p className="text-xs text-[#64748b]">
                  {success ? "90 days" : "88 days left"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div>
          <h2 className="text-lg font-semibold text-[#1a2332] mb-4">Check-in History</h2>
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
            {pastCheckIns.map((ci, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 px-5 py-4 ${
                  i < pastCheckIns.length - 1 ? "border-b border-[#e2e8f0]" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1a2332]">{ci.date}</p>
                </div>
                <span className="text-xs font-semibold text-[#22c55e] bg-[#22c55e]/10 px-2.5 py-1 rounded-full">
                  {ci.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
