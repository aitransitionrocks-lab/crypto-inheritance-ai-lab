"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Download,
  Loader2,
  Plus,
  UserPlus,
  UserMinus,
  Settings,
  CheckCircle,
  Edit3,
  Bell,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";

type EventType =
  | "plan_created"
  | "heir_added"
  | "heir_removed"
  | "trigger_configured"
  | "checkin"
  | "plan_edited"
  | "settings_changed";

interface AuditEntry {
  id: string;
  timestamp: string;
  type: EventType;
  description: string;
  ip: string;
}

const eventConfig: Record<
  EventType,
  { label: string; bg: string; text: string; icon: React.ElementType }
> = {
  plan_created: {
    label: "Plan Created",
    bg: "bg-[#22c55e]/10",
    text: "text-[#22c55e]",
    icon: Plus,
  },
  heir_added: {
    label: "Heir Added",
    bg: "bg-[#3b82f6]/10",
    text: "text-[#3b82f6]",
    icon: UserPlus,
  },
  heir_removed: {
    label: "Heir Removed",
    bg: "bg-[#ef4444]/10",
    text: "text-[#ef4444]",
    icon: UserMinus,
  },
  trigger_configured: {
    label: "Trigger Configured",
    bg: "bg-[#f59e0b]/10",
    text: "text-[#f59e0b]",
    icon: Bell,
  },
  checkin: {
    label: "Check-in",
    bg: "bg-[#22c55e]/10",
    text: "text-[#22c55e]",
    icon: CheckCircle,
  },
  plan_edited: {
    label: "Plan Edited",
    bg: "bg-[#8b5cf6]/10",
    text: "text-[#8b5cf6]",
    icon: Edit3,
  },
  settings_changed: {
    label: "Settings Changed",
    bg: "bg-[#64748b]/10",
    text: "text-[#64748b]",
    icon: Settings,
  },
};

const auditEntries: AuditEntry[] = [
  {
    id: "1",
    timestamp: "2026-03-19T14:32:00Z",
    type: "checkin",
    description: "Proof-of-life check-in completed via app.",
    ip: "192.168.1.***",
  },
  {
    id: "2",
    timestamp: "2026-03-18T09:15:00Z",
    type: "settings_changed",
    description: 'Notification preferences updated: SMS check-in enabled.',
    ip: "192.168.1.***",
  },
  {
    id: "3",
    timestamp: "2026-03-15T16:45:00Z",
    type: "heir_added",
    description: 'Heir "alice@example.com" added to plan "My Bitcoin Legacy".',
    ip: "10.0.0.***",
  },
  {
    id: "4",
    timestamp: "2026-03-14T11:20:00Z",
    type: "trigger_configured",
    description: "Dead man's switch set to 90-day interval with 7-day safety period.",
    ip: "10.0.0.***",
  },
  {
    id: "5",
    timestamp: "2026-03-12T08:00:00Z",
    type: "plan_edited",
    description: 'Plan "My Bitcoin Legacy" instructions updated.',
    ip: "192.168.1.***",
  },
  {
    id: "6",
    timestamp: "2026-03-10T10:30:00Z",
    type: "heir_removed",
    description: 'Heir "bob@example.com" removed from plan "My Bitcoin Legacy".',
    ip: "192.168.1.***",
  },
  {
    id: "7",
    timestamp: "2026-03-08T13:00:00Z",
    type: "plan_created",
    description: 'Inheritance plan "My Bitcoin Legacy" created with 1 vault.',
    ip: "10.0.0.***",
  },
];

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

function generateCSV(entries: AuditEntry[]) {
  const header = "Timestamp,Event Type,Description,IP Address";
  const rows = entries.map(
    (e) =>
      `"${e.timestamp}","${eventConfig[e.type].label}","${e.description}","${e.ip}"`
  );
  return [header, ...rows].join("\n");
}

export default function AuditPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signup");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a2332]" />
        </div>
      </AppLayout>
    );
  }

  function handleExport() {
    const csv = generateCSV(auditEntries);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "legacyguard_audit_log.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1a2332] flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#c9a84c]" />
              Audit Trail
            </h1>
            <p className="text-[#64748b] mt-1">
              Complete log of all account actions and events.
            </p>
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2.5 bg-[#1a2332] text-white rounded-xl text-sm font-semibold hover:bg-[#2a3a4f] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Audit Log
          </button>
        </div>

        {/* Audit Entries */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-6">
          {auditEntries.map((entry, i) => {
            const config = eventConfig[entry.type];
            const Icon = config.icon;
            const { date, time } = formatTimestamp(entry.timestamp);

            return (
              <div
                key={entry.id}
                className={`flex items-start gap-4 p-5 ${
                  i !== auditEntries.length - 1
                    ? "border-b border-[#f1f5f9]"
                    : ""
                } hover:bg-[#f8fafc] transition-colors`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}
                >
                  <Icon className={`w-4 h-4 ${config.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${config.bg} ${config.text}`}
                    >
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-[#1a2332]">{entry.description}</p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-xs text-[#94a3b8]">
                      {date} at {time}
                    </span>
                    <span className="text-xs text-[#94a3b8] font-mono">
                      IP: {entry.ip}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Retention Notice */}
        <div className="bg-[#3b82f6]/5 border border-[#3b82f6]/20 rounded-2xl p-5 text-center">
          <p className="text-sm text-[#1e40af]">
            Audit logs are retained for 7 years for compliance purposes.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
