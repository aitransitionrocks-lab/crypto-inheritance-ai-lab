"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import ProgressSteps from "@/components/ui/ProgressSteps";
import { apiPost } from "@/services/api";

interface Heir {
  name: string;
  email: string;
  relationship: string;
}

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
      setError("Please fill in all heir details.");
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

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <ProgressSteps
          steps={["Vault Setup", "Create Plan", "Complete"]}
          currentStep={2}
        />

        <div className="mt-12 text-center">
          <h1 className="text-3xl font-bold text-navy mb-3">
            Create Your Inheritance Plan
          </h1>
          <p className="text-text-secondary text-lg">
            Define how and when your plan activates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-8">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-error">
              {error}
            </div>
          )}

          <Card padding="lg">
            <h2 className="text-lg font-semibold text-text-primary mb-5">
              Plan Details
            </h2>
            <div className="flex flex-col gap-5">
              <Input
                label="Plan Name"
                placeholder="e.g., Family Legacy Plan"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">
                  Trigger Interval: {triggerDays} days
                </label>
                <input
                  type="range"
                  min={30}
                  max={365}
                  step={1}
                  value={triggerDays}
                  onChange={(e) => setTriggerDays(Number(e.target.value))}
                  className="w-full accent-navy"
                />
                <div className="flex justify-between text-xs text-text-muted">
                  <span>30 days</span>
                  <span>365 days</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">
                  Check-in Method
                </label>
                <select
                  value={checkInMethod}
                  onChange={(e) => setCheckInMethod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="email">Email</option>
                  <option value="push">Push Notification</option>
                  <option value="both">Email + Push</option>
                </select>
              </div>
              <p className="text-sm text-text-secondary bg-amber-50 rounded-lg p-3 border border-amber-200">
                If you don&apos;t check in for{" "}
                <span className="font-semibold">{triggerDays} days</span>, your
                heirs will be notified via {checkInMethod}.
              </p>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text-primary">Heirs</h2>
              <Button variant="ghost" size="sm" type="button" onClick={addHeir}>
                <Plus className="w-4 h-4" /> Add Heir
              </Button>
            </div>
            <div className="flex flex-col gap-6">
              {heirs.map((heir, index) => (
                <div
                  key={index}
                  className="p-4 border border-border rounded-lg bg-bg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-text-secondary">
                      Heir {index + 1}
                    </span>
                    {heirs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHeir(index)}
                        className="p-1 text-error hover:bg-red-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      placeholder="Full name"
                      value={heir.name}
                      onChange={(e) =>
                        updateHeir(index, "name", e.target.value)
                      }
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={heir.email}
                      onChange={(e) =>
                        updateHeir(index, "email", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Relationship"
                      value={heir.relationship}
                      onChange={(e) =>
                        updateHeir(index, "relationship", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="text-center">
            <Button type="submit" size="lg" loading={loading}>
              Create Plan &amp; Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
