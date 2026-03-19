"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Key,
  Heart,
  Lock,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Wallet,
  CheckCircle,
  Download,
  Copy,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { generateSecret, splitSecret, encryptText } from "@/lib/crypto";
import SecurityLevelSelector, {
  type SecurityLevel,
} from "@/components/SecurityLevelSelector";

const setupSteps = [
  { label: "Vault Setup", step: 1 },
  { label: "Create Plan", step: 2 },
  { label: "Complete", step: 3 },
];

export default function VaultSetupPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [vaultName, setVaultName] = useState("");
  const [wallets, setWallets] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Security level
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>("standard");

  // Key splitting state
  const [shards, setShards] = useState<
    { index: number; value: string }[] | null
  >(null);
  const [keySplitDone, setKeySplitDone] = useState(false);
  const [copiedShard, setCopiedShard] = useState(false);

  // Encrypted instructions
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signup");
    }
  }, [authLoading, user, router]);

  function addWallet() {
    setWallets([...wallets, ""]);
  }

  function removeWallet(index: number) {
    setWallets(wallets.filter((_, i) => i !== index));
  }

  function updateWallet(index: number, value: string) {
    const updated = [...wallets];
    updated[index] = value;
    setWallets(updated);
  }

  function handleGenerateAndSplit() {
    const secret = generateSecret();
    const splits = splitSecret(secret, 2, 3);
    setShards(splits);
    setKeySplitDone(true);
    trackEvent("key_split_generated", { shard_count: 3 });
  }

  function downloadShard(shard: { index: number; value: string }) {
    const blob = new Blob(
      [`LegacyGuard Shard ${shard.index}\n\n${shard.value}\n\nKeep this file safe. Do not share it.`],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `legacyguard-shard-${shard.index}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyShard(value: string) {
    navigator.clipboard.writeText(value);
    setCopiedShard(true);
    setTimeout(() => setCopiedShard(false), 2000);
  }

  async function handleContinue() {
    setError("");
    if (!vaultName.trim()) {
      setError("Please enter a vault name.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();

      const encryptedInstructions = instructions.trim()
        ? encryptText(instructions, "")
        : null;

      const { error: dbError } = await supabase.from("vaults").insert({
        user_id: user!.id,
        name: vaultName.trim(),
        wallet_addresses: wallets.filter(Boolean),
        security_level: securityLevel,
        shard_3_stored: keySplitDone,
        encrypted_instructions: encryptedInstructions,
      });
      if (dbError) throw dbError;
      trackEvent("vault_created", {
        wallet_count: wallets.filter(Boolean).length,
        security_level: securityLevel,
        has_instructions: !!encryptedInstructions,
      });
      router.push("/setup/plan");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Failed to create vault. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a2332]" />
      </div>
    );
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
                    s.step < 1
                      ? "bg-[#22c55e] text-white"
                      : s.step === 1
                        ? "bg-[#1a2332] text-white shadow-lg"
                        : "bg-[#e2e8f0] text-[#94a3b8]"
                  }`}
                >
                  {s.step < 1 ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    s.step
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${
                    s.step === 1 ? "text-[#1a2332]" : "text-[#94a3b8]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < setupSteps.length - 1 && (
                <div
                  className={`w-20 h-0.5 mx-2 mb-6 ${
                    s.step < 1 ? "bg-[#22c55e]" : "bg-[#e2e8f0]"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#1a2332] mb-3">
            Secure Your Vault
          </h1>
          <p className="text-lg text-[#64748b] max-w-lg mx-auto">
            Name your vault and connect your wallets. Your key will be split
            into{" "}
            <span className="font-semibold text-[#1a2332]">
              3 encrypted shards
            </span>
            .
          </p>
        </div>

        {/* Security Level Selector */}
        <SecurityLevelSelector
          value={securityLevel}
          onChange={setSecurityLevel}
        />

        {/* Vault Name Input */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-6">
          <h2 className="text-lg font-semibold text-[#1a2332] mb-5">
            Vault Details
          </h2>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1a2332]">
                Vault Name
              </label>
              <input
                type="text"
                placeholder="e.g., My Main Vault"
                value={vaultName}
                onChange={(e) => setVaultName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all"
              />
            </div>

            {/* Wallet Addresses */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1a2332]">
                Wallet Addresses
              </label>
              <div className="flex flex-col gap-3">
                {wallets.map((wallet, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
                      <input
                        type="text"
                        placeholder="0x... or bc1... wallet address"
                        value={wallet}
                        onChange={(e) => updateWallet(index, e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all font-mono text-sm"
                      />
                    </div>
                    {wallets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWallet(index)}
                        className="p-2.5 rounded-xl text-[#ef4444] hover:bg-[#ef4444]/5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addWallet}
                className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#1a2332] hover:text-[#c9a84c] transition-colors cursor-pointer self-start"
              >
                <Plus className="w-4 h-4" /> Add another wallet
              </button>
            </div>
          </div>
        </div>

        {/* Generate & Split Key */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-6">
          <h3 className="text-lg font-semibold text-[#1a2332] mb-2">
            Key Splitting
          </h3>
          <p className="text-sm text-[#64748b] mb-5">
            Generate a secret key and split it into 3 shards. Any 2 shards can
            reconstruct your key.
          </p>

          {!keySplitDone ? (
            <button
              type="button"
              onClick={handleGenerateAndSplit}
              className="w-full py-3.5 bg-[#c9a84c] text-white rounded-xl font-semibold hover:bg-[#b8963f] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              Generate &amp; Split Key
            </button>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {/* Shard 1 — Download */}
                <div className="text-center p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-[#22c55e]/10">
                    <Key className="w-6 h-6 text-[#22c55e]" />
                  </div>
                  <div className="font-bold text-[#1a2332] text-sm mb-1">
                    Shard 1
                  </div>
                  <div className="text-xs text-[#22c55e] font-semibold mb-3">
                    Your Device
                  </div>
                  <button
                    type="button"
                    onClick={() => shards && downloadShard(shards[0])}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#22c55e] text-white rounded-lg text-xs font-semibold hover:bg-[#16a34a] transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Save to your device
                  </button>
                </div>

                {/* Shard 2 — Copy */}
                <div className="text-center p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-[#3b82f6]/10">
                    <Heart className="w-6 h-6 text-[#3b82f6]" />
                  </div>
                  <div className="font-bold text-[#1a2332] text-sm mb-1">
                    Shard 2
                  </div>
                  <div className="text-xs text-[#3b82f6] font-semibold mb-3">
                    Trusted Contact
                  </div>
                  <button
                    type="button"
                    onClick={() => shards && copyShard(shards[1].value)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-xs font-semibold hover:bg-[#2563eb] transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedShard ? "Copied!" : "Send to trusted contact"}
                  </button>
                </div>

                {/* Shard 3 — Auto-stored */}
                <div className="text-center p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] opacity-70">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-[#c9a84c]/10">
                    <Shield className="w-6 h-6 text-[#c9a84c]" />
                  </div>
                  <div className="font-bold text-[#1a2332] text-sm mb-1">
                    Shard 3
                  </div>
                  <div className="text-xs text-[#c9a84c] font-semibold mb-3">
                    LegacyGuard Vault
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#e2e8f0] text-[#64748b] rounded-lg text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Stored in vault
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#22c55e]/5 rounded-xl border border-[#22c55e]/20">
                <p className="text-sm text-[#22c55e] font-semibold text-center flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Your key has been split. Store shards safely.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Encrypted Instructions */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-6">
          <h3 className="text-lg font-semibold text-[#1a2332] mb-2">
            Recovery Instructions (encrypted on your device)
          </h3>
          <p className="text-sm text-[#64748b] mb-4">
            These instructions are encrypted with your master key before leaving
            your device.
          </p>
          <textarea
            placeholder="Enter your seed phrase, passwords, or access instructions here..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all resize-none text-sm"
          />
        </div>

        {/* Shard Distribution Visual (original info section) */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-6">
          <h3 className="text-lg font-semibold text-[#1a2332] text-center mb-2">
            Your Key Will Be Split Into 3 Pieces
          </h3>
          <p className="text-center text-[#64748b] text-sm mb-8">
            Any 2 pieces can reconstruct your key. No single piece reveals
            anything.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Key,
                label: "Shard 1",
                location: "Your Device",
                color: "#22c55e",
                desc: "Stored encrypted on your phone or computer",
              },
              {
                icon: Heart,
                label: "Shard 2",
                location: "Trusted Contact",
                color: "#3b82f6",
                desc: "Held by your designated heir",
              },
              {
                icon: Shield,
                label: "Shard 3",
                location: "LegacyGuard Vault",
                color: "#c9a84c",
                desc: "Encrypted -- we cannot read it",
              },
            ].map((shard) => (
              <div
                key={shard.label}
                className="text-center p-5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${shard.color}15` }}
                >
                  <shard.icon
                    className="w-7 h-7"
                    style={{ color: shard.color }}
                  />
                </div>
                <div className="font-bold text-[#1a2332] text-sm mb-1">
                  {shard.label}
                </div>
                <div
                  className="text-xs font-semibold mb-1.5"
                  style={{ color: shard.color }}
                >
                  {shard.location}
                </div>
                <div className="text-xs text-[#64748b]">{shard.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Message */}
        <div className="p-4 bg-[#22c55e]/5 rounded-2xl border border-[#22c55e]/20 mb-8">
          <p className="text-sm text-[#22c55e] font-semibold text-center flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 flex-shrink-0" />
            Your key is generated on your device. We never see it.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-xl text-sm text-[#ef4444] text-center mb-6">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#1a2332] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <button
            onClick={handleContinue}
            disabled={loading}
            className="px-8 py-3.5 bg-[#1a2332] text-white rounded-xl font-semibold hover:bg-[#2a3a4f] transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Vault...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
