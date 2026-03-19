"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Gift,
  Copy,
  Check,
  Users,
  Award,
  Share2,
  Loader2,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";

export default function ReferralPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [copied, setCopied] = useState(false);

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

  const referralCode = user?.id ? user.id.substring(0, 8) : "--------";
  const referralLink = `https://frontend-sage-nine-13.vercel.app/signup?ref=${referralCode}`;

  const tweetText = encodeURIComponent(
    "I'm using LegacyGuard to protect my crypto legacy. Non-custodial, open source. Check it out:"
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(referralLink)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Save referral code to Supabase profiles
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        await supabase
          .from("profiles")
          .upsert({ id: user?.id, referral_code: referralCode });
      } catch {
        // Graceful fallback: table may not exist yet
      }
    } catch {
      // Clipboard API may not be available
    }
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1a2332]">Invite a Friend</h1>
          <p className="text-[#64748b] mt-1">
            Share LegacyGuard and earn rewards together.
          </p>
        </div>

        {/* Reward Banner */}
        <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-2xl p-6 mb-8 text-center">
          <Gift className="w-10 h-10 text-[#c9a84c] mx-auto mb-3" />
          <h2 className="text-lg font-bold text-[#1a2332] mb-1">
            Refer a friend &rarr; both get 3 months Pro free
          </h2>
          <p className="text-sm text-[#64748b]">
            When your friend signs up and creates their first plan, you both
            unlock 3 months of Pro features at no cost.
          </p>
        </div>

        {/* Referral Link */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-6">
          <label className="text-sm font-medium text-[#1a2332] mb-2 block">
            Your Referral Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-[#0f172a] text-sm font-mono"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-3 bg-[#1a2332] text-white rounded-xl font-semibold hover:bg-[#2a3a4f] transition-colors flex items-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-[#94a3b8] mt-2">
            Your referral code: <span className="font-mono font-semibold">{referralCode}</span>
          </p>
        </div>

        {/* Share on Twitter */}
        <div className="mb-8">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1da1f2] text-white rounded-xl font-semibold hover:bg-[#1a8cd8] transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Share on Twitter
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 text-center">
            <Users className="w-8 h-8 text-[#3b82f6] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1a2332]">0</div>
            <div className="text-sm text-[#64748b]">Referrals</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 text-center">
            <Award className="w-8 h-8 text-[#c9a84c] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#1a2332]">0</div>
            <div className="text-sm text-[#64748b]">Rewards Earned</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
