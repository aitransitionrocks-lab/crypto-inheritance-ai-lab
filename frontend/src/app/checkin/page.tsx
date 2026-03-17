"use client";

import React, { useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { apiPost } from "@/services/api";

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
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Check In
        </h1>
        <p className="text-text-secondary mb-10">
          Confirm your presence to keep your plan active.
        </p>

        <Card padding="lg" className="mb-8">
          {success ? (
            <div className="py-8">
              <CheckCircle className="w-20 h-20 text-success mx-auto mb-4" />
              <h2 className="text-xl font-bold text-success mb-2">
                Check-in Successful!
              </h2>
              <p className="text-text-secondary">
                Your plan timer has been reset.
              </p>
            </div>
          ) : (
            <div className="py-8">
              <Button
                size="lg"
                loading={loading}
                onClick={handleCheckIn}
                className="w-40 h-40 rounded-full text-xl"
              >
                {loading ? "Checking..." : "I'm Here"}
              </Button>
              {error && (
                <p className="mt-4 text-sm text-error">{error}</p>
              )}
            </div>
          )}
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card padding="md">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-text-muted" />
              <div className="text-left">
                <p className="text-xs text-text-secondary">Last Check-in</p>
                <p className="text-sm font-semibold text-text-primary">
                  {success ? "Just now" : "2 hours ago"}
                </p>
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-text-muted" />
              <div className="text-left">
                <p className="text-xs text-text-secondary">Next Due</p>
                <p className="text-sm font-semibold text-text-primary">
                  {success ? "90 days" : "28 days"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
