"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Clock,
  Mail,
  Smartphone,
  Bell,
  AlertTriangle,
  Users,
} from "lucide-react";
import { apiPost } from "@/services/api";

interface Heir {
  name: string;
  email: string;
  relationship: string;
}

const setupSteps = [
  { label: "Vault Setup", step: 1 },
  { label: "Create Plan", step: 2 },
  { label: "Complete", step: 3 },
];

const relationships = [
  "Spouse",
  "Child",
  "Parent",
  "Sibling",
  "Business Partner",
  "Attorney",
  "Other",
];

const checkInMethods = [
  { value: "email", label: "Email", icon: Mail, desc: "Receive check-in reminders via email" },
  { value: "sms", label: "SMS", icon: Smartphone, desc: "Get a text message reminder" },
  { value: "push", label: "App Push", icon: Bell, desc: "Push notification to the LegacyGuard app" },
];

export default function PlanSetupPage() {
  const router = useRouter();
  const [planName, setPlanName] = useState("");
  const [triggerDays, setTriggerDays] = useState(90);
  const [checkInMethod, setCheckInMethod] = useState("email");
  const [heirs, setHeirs] = useState<Heir[]>([
    { name: "", email: "", relationship: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function addHeir() {
    setHeirs([...heirs, { name: "", email: "", relationship: "" }]);
  }

  function removeHeir(index: number) {
    setHeirs(heirs.filter((_, i) => i !== index));
  }

  function updateHeir(index: number, field: keyof Heir, value: string) {
    const updated = [...heirs];
    updated[index] = { ...updated[index], [field]: value };
    setHeirs(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!planName.trim()) {
      setError("Please enter a plan name.");
      return;
    }
    if (heirs.some((h) => !h.name || !h.email)) {
      setError("Please fill in all heir details (name and email required).");
      return;
    }

    setLoading(true);
    try {
      const planRes = await apiPost<{ id: string }>("/api/plans", {
        name: planName,
        trigger_days: triggerDays,
        check_in_method: checkInMethod,
      });
      const planId = planRes.data.id;
      for (const heir of heirs) {
        await apiPost(`/api/plans/${planId}/heirs`, heir);
      }
      router.push("/setup/complete");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Failed to create plan. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function getTriggerLabel(): string {
    if (triggerDays <= 30) return "Very Frequent";
    if (triggerDays <= 90) return "Recommended";
    if (triggerDays <= 180) return "Moderate";
    return "Extended";
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {setupSteps.map((s, i) => (
            <React.Fragment key={s.step}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    s.step < 2
                      ? "bg-[#22c55e] text-white"
                      : s.step === 2
                        ? "bg-[#1a2332] text-white shadow-lg"
                        : "bg-[#e2e8f0] text-[#94a3b8]"
                  }`}
                >
                  {s.step < 2 ? <CheckCircle className="w-5 h-5" /> : s.step}
                </div>
                <span
                  className={`text-xs font-medium ${
                    s.step <= 2 ? "text-[#1a2332]" : "text-[#94a3b8]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < setupSteps.length - 1 && (
                <div
                  className={`w-20 h-0.5 mx-2 mb-6 ${
                    s.step < 2 ? "bg-[#22c55e]" : "bg-[#e2e8f0]"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#1a2332] mb-3">Create Your Inheritance Plan</h1>
          <p className="text-lg text-[#64748b]">Define how and when your plan activates.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="p-3 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-xl text-sm text-[#ef4444] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Plan Details Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8">
            <h2 className="text-lg font-semibold text-[#1a2332] mb-5">Plan Details</h2>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1a2332]">Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g., Family Legacy Plan"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Heirs Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#c9a84c]" />
                <h2 className="text-lg font-semibold text-[#1a2332]">Heirs</h2>
              </div>
              <button
                type="button"
                onClick={addHeir}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#1a2332] hover:bg-[#f8fafc] border border-[#e2e8f0] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Heir
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {heirs.map((heir, index) => (
                <div
                  key={index}
                  className="p-5 border border-[#e2e8f0] rounded-xl bg-[#f8fafc]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-[#64748b]">
                      Heir {index + 1}
                    </span>
                    {heirs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHeir(index)}
                        className="p-1.5 text-[#ef4444] hover:bg-[#ef4444]/5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-[#64748b]">Full Name</label>
                      <input
                        type="text"
                        placeholder="Jane Smith"
                        value={heir.name}
                        onChange={(e) => updateHeir(index, "name", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-[#64748b]">Email</label>
                      <input
                        type="email"
                        placeholder="jane@example.com"
                        value={heir.email}
                        onChange={(e) => updateHeir(index, "email", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-[#64748b]">Relationship</label>
                      <select
                        value={heir.relationship}
                        onChange={(e) => updateHeir(index, "relationship", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-[#e2e8f0] text-[#0f172a] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all bg-white"
                      >
                        <option value="">Select...</option>
                        {relationships.map((r) => (
                          <option key={r} value={r.toLowerCase()}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trigger Settings Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-[#c9a84c]" />
              <h2 className="text-lg font-semibold text-[#1a2332]">Trigger Settings</h2>
            </div>

            {/* Inactivity Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-[#1a2332]">
                  Inactivity Period
                </label>
                <span className="px-3 py-1 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] text-sm font-bold">
                  {triggerDays} days
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={365}
                step={1}
                value={triggerDays}
                onChange={(e) => setTriggerDays(Number(e.target.value))}
                className="w-full accent-[#1a2332] h-2 rounded-full cursor-pointer"
              />
              <div className="flex justify-between mt-2 text-xs text-[#94a3b8]">
                <span>30 days</span>
                <span className="font-medium text-[#c9a84c]">{getTriggerLabel()}</span>
                <span>365 days</span>
              </div>
            </div>

            {/* Check-in Method */}
            <div>
              <label className="text-sm font-medium text-[#1a2332] block mb-3">
                Check-in Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {checkInMethods.map((method) => {
                  const Icon = method.icon;
                  const isActive = checkInMethod === method.value;
                  return (
                    <label
                      key={method.value}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                        isActive
                          ? "border-[#1a2332] bg-[#1a2332]/5"
                          : "border-[#e2e8f0] hover:border-[#94a3b8]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="checkInMethod"
                        value={method.value}
                        checked={isActive}
                        onChange={(e) => setCheckInMethod(e.target.value)}
                        className="sr-only"
                      />
                      <Icon className={`w-6 h-6 ${isActive ? "text-[#1a2332]" : "text-[#94a3b8]"}`} />
                      <span className={`text-sm font-semibold ${isActive ? "text-[#1a2332]" : "text-[#64748b]"}`}>
                        {method.label}
                      </span>
                      <span className="text-xs text-[#94a3b8]">{method.desc}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Preview Box */}
          <div className="p-5 bg-[#f59e0b]/5 rounded-2xl border border-[#f59e0b]/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#1a2332] mb-1">Plan Preview</p>
                <p className="text-sm text-[#64748b]">
                  If you don&apos;t check in for{" "}
                  <span className="font-bold text-[#1a2332]">{triggerDays} days</span>, your{" "}
                  <span className="font-bold text-[#1a2332]">{heirs.length} heir{heirs.length > 1 ? "s" : ""}</span>{" "}
                  will be notified via{" "}
                  <span className="font-bold text-[#1a2332]">{checkInMethod}</span>.
                  A 7-day safety period allows you to cancel if triggered by mistake.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Link
              href="/setup/vault"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#1a2332] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-[#1a2332] text-white rounded-xl font-semibold hover:bg-[#2a3a4f] transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Plan...
                </>
              ) : (
                <>
                  Create Plan
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
