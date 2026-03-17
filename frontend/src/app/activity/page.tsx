"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  Loader2,
  Activity,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { useCheckins } from "@/hooks/useSupabase";

export default function ActivityPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { checkins, loading: checkinsLoading } = useCheckins();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signup");
    }
  }, [authLoading, user, router]);

  if (authLoading || checkinsLoading) {
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1a2332]">Activity Log</h1>
          <p className="text-[#64748b] mt-1">
            A complete timeline of your account activity.
          </p>
        </div>

        {checkins.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#e2e8f0] flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-[#94a3b8]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1a2332] mb-1">
              No Activity Yet
            </h3>
            <p className="text-sm text-[#64748b]">
              Your check-ins and account events will appear here.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-5 top-0 bottom-0 w-px"
              style={{ backgroundColor: "#e2e8f0" }}
            />

            <div className="flex flex-col gap-4">
              {checkins.map((ci, i) => {
                const date = new Date(ci.created_at);
                const formattedDate = date.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                });
                const formattedTime = date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                });

                return (
                  <div key={ci.id} className="relative flex items-start gap-4 pl-2">
                    {/* Timeline dot */}
                    <div
                      className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: i === 0 ? "#22c55e15" : "#3b82f615",
                        border: `2px solid ${i === 0 ? "#22c55e" : "#3b82f6"}`,
                      }}
                    >
                      {i === 0 ? (
                        <CheckCircle className="w-3.5 h-3.5 text-[#22c55e]" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-[#3b82f6]" />
                      )}
                    </div>

                    {/* Content card */}
                    <div className="flex-1 bg-white rounded-xl border border-[#e2e8f0] p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[#1a2332]">
                            Check-in Completed
                          </p>
                          <p className="text-xs text-[#64748b] mt-0.5">
                            Method: {ci.method || "app"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-[#1a2332]">
                            {formattedDate}
                          </p>
                          <p className="text-xs text-[#94a3b8]">
                            {formattedTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
