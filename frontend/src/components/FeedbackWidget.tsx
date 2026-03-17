"use client";

import React, { useState } from "react";
import { MessageSquare, X, Star, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/analytics";

// Supabase table setup - Run in Supabase SQL Editor:
// CREATE TABLE IF NOT EXISTS public.feedback (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   user_id UUID REFERENCES auth.users(id),
//   security_confidence INTEGER CHECK (security_confidence BETWEEN 1 AND 5),
//   confusion_notes TEXT,
//   willingness_to_pay TEXT,
//   page TEXT,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
// ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Users can insert feedback" ON public.feedback FOR INSERT WITH CHECK (true);
// CREATE POLICY "Users can view own feedback" ON public.feedback FOR SELECT USING (auth.uid() = user_id);

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [confusion, setConfusion] = useState("");
  const [willingness, setWillingness] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const feedbackData = {
      security_confidence: confidence,
      confusion_notes: confusion,
      willingness_to_pay: willingness,
      page: typeof window !== "undefined" ? window.location.pathname : "",
    };

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("feedback").insert({
        ...feedbackData,
        user_id: user?.id ?? null,
      });

      if (error) {
        // Table may not exist yet - log to console as fallback
        console.log("[Feedback] Supabase insert failed (table may not exist):", error.message);
        console.log("[Feedback] Data:", feedbackData);
      }
    } catch {
      // Graceful fallback - log to console
      console.log("[Feedback] Fallback - saving to console:", feedbackData);
    }

    trackEvent("feedback_submitted", { confidence });
    setSubmitted(true);
    setLoading(false);
  }

  function handleClose() {
    setOpen(false);
    // Reset after close animation
    setTimeout(() => {
      setSubmitted(false);
      setConfidence(0);
      setConfusion("");
      setWillingness("");
    }, 300);
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#1a2332] text-[#c9a84c] shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
        aria-label="Open feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-[#e2e8f0] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a2332]">
              <h3 className="text-white font-semibold text-lg">Share Feedback</h3>
              <button
                onClick={handleClose}
                className="text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                aria-label="Close feedback"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#22c55e]/10 mb-4">
                  <Star className="w-8 h-8 text-[#22c55e]" />
                </div>
                <h4 className="text-lg font-bold text-[#1a2332] mb-2">
                  Thank you!
                </h4>
                <p className="text-sm text-[#64748b]">
                  Your feedback helps us build a better product.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 px-6 py-2.5 bg-[#1a2332] text-white rounded-xl text-sm font-semibold hover:bg-[#2a3a4f] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                {/* Star Rating */}
                <div>
                  <label className="text-sm font-medium text-[#1a2332] block mb-2">
                    How confident do you feel about the security?
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setConfidence(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            star <= confidence
                              ? "text-[#c9a84c] fill-[#c9a84c]"
                              : "text-[#e2e8f0]"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confusion */}
                <div>
                  <label className="text-sm font-medium text-[#1a2332] block mb-2">
                    What confused you?
                  </label>
                  <textarea
                    value={confusion}
                    onChange={(e) => setConfusion(e.target.value)}
                    placeholder="Anything unclear or confusing..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Willingness to Pay */}
                <div>
                  <label className="text-sm font-medium text-[#1a2332] block mb-2">
                    Would you pay for this? How much?
                  </label>
                  <textarea
                    value={willingness}
                    onChange={(e) => setWillingness(e.target.value)}
                    placeholder="e.g., Yes, $10/month for premium features"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-[#0f172a] placeholder-[#94a3b8] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || confidence === 0}
                  className="w-full py-3 bg-[#1a2332] text-white rounded-xl font-semibold hover:bg-[#2a3a4f] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
