"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Webhook,
  Plus,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const webhookEvents = [
  {
    name: "plan.created",
    description: "Triggered when a new inheritance plan is created.",
    payload: `{
  "event": "plan.created",
  "timestamp": "2026-03-19T12:00:00Z",
  "data": {
    "plan_id": "pln_abc123",
    "user_id": "usr_xyz789",
    "name": "My Bitcoin Legacy",
    "trigger_days": 90
  }
}`,
  },
  {
    name: "heir.added",
    description: "Triggered when an heir is added to a plan.",
    payload: `{
  "event": "heir.added",
  "timestamp": "2026-03-19T12:05:00Z",
  "data": {
    "plan_id": "pln_abc123",
    "heir_id": "heir_def456",
    "heir_email": "heir@example.com",
    "shard_delivered": true
  }
}`,
  },
  {
    name: "checkin.completed",
    description: "Triggered when the user completes a check-in.",
    payload: `{
  "event": "checkin.completed",
  "timestamp": "2026-03-19T12:30:00Z",
  "data": {
    "user_id": "usr_xyz789",
    "method": "app",
    "next_deadline": "2026-06-17T12:30:00Z"
  }
}`,
  },
  {
    name: "trigger.activated",
    description: "Triggered when the dead man's switch activates due to missed check-in.",
    payload: `{
  "event": "trigger.activated",
  "timestamp": "2026-06-17T12:30:00Z",
  "data": {
    "plan_id": "pln_abc123",
    "user_id": "usr_xyz789",
    "safety_period_ends": "2026-06-24T12:30:00Z"
  }
}`,
  },
  {
    name: "trigger.cancelled",
    description: "Triggered when the user cancels an activated trigger by checking in.",
    payload: `{
  "event": "trigger.cancelled",
  "timestamp": "2026-06-18T08:00:00Z",
  "data": {
    "plan_id": "pln_abc123",
    "user_id": "usr_xyz789",
    "cancelled_via": "app"
  }
}`,
  },
  {
    name: "recovery.initiated",
    description: "Triggered when the recovery process begins after the safety period expires.",
    payload: `{
  "event": "recovery.initiated",
  "timestamp": "2026-06-24T12:30:00Z",
  "data": {
    "plan_id": "pln_abc123",
    "heirs_notified": 2,
    "shards_released": true
  }
}`,
  },
];

export default function WebhooksPage() {
  const [endpointUrl, setEndpointUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [copiedEvent, setCopiedEvent] = useState<string | null>(null);

  function toggleEvent(name: string) {
    setSelectedEvents((prev) =>
      prev.includes(name)
        ? prev.filter((e) => e !== name)
        : [...prev, name]
    );
  }

  async function handleCopyPayload(name: string, payload: string) {
    try {
      await navigator.clipboard.writeText(payload);
      setCopiedEvent(name);
      setTimeout(() => setCopiedEvent(null), 2000);
    } catch {
      // Clipboard API may not be available
    }
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
          <Link href="/developers" className="text-sm font-medium text-[#64748b] hover:text-[#1a2332]">
            Developer Docs
          </Link>
          <Link href="/partners" className="text-sm font-medium text-[#64748b] hover:text-[#1a2332]">
            Partners
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Webhook className="w-6 h-6 text-[#c9a84c]" />
            <h1 className="text-2xl font-bold text-[#1a2332]">Webhook Events</h1>
          </div>
          <p className="text-[#64748b]">
            Subscribe to real-time events from LegacyGuard. Webhooks deliver
            JSON payloads to your endpoint via HTTP POST.
          </p>
        </div>

        {/* Event List */}
        <div className="flex flex-col gap-4 mb-12">
          {webhookEvents.map((evt) => (
            <div
              key={evt.name}
              className="bg-white rounded-2xl border border-[#e2e8f0] p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <code className="text-sm font-bold text-[#1a2332] bg-[#f1f5f9] px-2 py-1 rounded">
                    {evt.name}
                  </code>
                  <p className="text-sm text-[#64748b] mt-2">{evt.description}</p>
                </div>
                <button
                  onClick={() => handleCopyPayload(evt.name, evt.payload)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#64748b] hover:text-[#1a2332] border border-[#e2e8f0] rounded-lg transition-colors cursor-pointer"
                >
                  {copiedEvent === evt.name ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-[#1a2332] text-[#e2e8f0] text-xs rounded-xl p-4 overflow-x-auto">
                <code>{evt.payload}</code>
              </pre>
            </div>
          ))}
        </div>

        {/* Add Endpoint Form */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8">
          <h2 className="text-lg font-bold text-[#1a2332] mb-1 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Endpoint
          </h2>
          <p className="text-sm text-[#64748b] mb-6">
            Configure a URL to receive webhook events.
          </p>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1a2332]">
                Endpoint URL
              </label>
              <input
                type="url"
                placeholder="https://your-app.com/webhooks/legacyguard"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1a2332]">
                Events to Subscribe
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {webhookEvents.map((evt) => (
                  <label
                    key={evt.name}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(evt.name)}
                      onChange={() => toggleEvent(evt.name)}
                      className="rounded border-[#e2e8f0] text-[#c9a84c] focus:ring-[#c9a84c]"
                    />
                    <code className="text-xs text-[#1a2332]">{evt.name}</code>
                  </label>
                ))}
              </div>
            </div>

            <button
              disabled
              className="w-full py-3.5 bg-[#1a2332] text-white rounded-xl font-semibold flex items-center justify-center gap-2 opacity-60 cursor-not-allowed relative"
            >
              Save Endpoint
              <span className="ml-2 px-2 py-0.5 bg-[#f59e0b] text-white text-xs font-bold rounded-full">
                Coming Soon
              </span>
            </button>
          </div>
        </div>

        {/* Footer link */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <Link
            href="/developers"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#1a2332] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            API Documentation
          </Link>
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#1a2332] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Partner Program
          </Link>
        </div>
      </div>
    </div>
  );
}
