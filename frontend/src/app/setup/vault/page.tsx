"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, UserCheck, Vault } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressSteps from "@/components/ui/ProgressSteps";
import { apiPost } from "@/services/api";

const shards = [
  {
    icon: Smartphone,
    title: "Your Device",
    description: "Encrypted shard stored locally on your device",
    color: "text-info",
    bg: "bg-blue-50",
  },
  {
    icon: UserCheck,
    title: "Trusted Contact",
    description: "Encrypted shard held by your designated heir",
    color: "text-success",
    bg: "bg-green-50",
  },
  {
    icon: Vault,
    title: "Secure Vault",
    description: "Encrypted shard in LegacyGuard's secure storage",
    color: "text-gold",
    bg: "bg-amber-50",
  },
];

export default function VaultSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      await apiPost("/api/vaults", { name: "My Main Vault" });
      router.push("/setup/plan");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Failed to generate key. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <ProgressSteps
          steps={["Vault Setup", "Create Plan", "Complete"]}
          currentStep={1}
        />

        <div className="mt-12 text-center">
          <h1 className="text-3xl font-bold text-navy mb-3">
            Secure Your Vault
          </h1>
          <p className="text-text-secondary text-lg max-w-lg mx-auto">
            Your key will be split into{" "}
            <span className="font-semibold text-navy">3 shards</span> using
            Shamir Secret Sharing. Any 2 of 3 shards can reconstruct your key.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {shards.map((shard) => {
            const Icon = shard.icon;
            return (
              <Card key={shard.title} padding="md" className="text-center">
                <div
                  className={`w-14 h-14 rounded-full ${shard.bg} flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`w-7 h-7 ${shard.color}`} />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">
                  {shard.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {shard.description}
                </p>
              </Card>
            );
          })}
        </div>

        {error && (
          <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-error text-center">
            {error}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button size="lg" loading={loading} onClick={handleGenerate}>
            Generate &amp; Split Key
          </Button>
        </div>

        <Card padding="md" className="mt-8 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-info flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              <span className="font-semibold text-text-primary">
                Trust guarantee:
              </span>{" "}
              LegacyGuard cannot access your keys. We store only 1 of 3 shards,
              which alone reveals nothing about your private key.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
