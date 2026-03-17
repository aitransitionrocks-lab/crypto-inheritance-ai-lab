"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle, Shield, Users, Clock } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressSteps from "@/components/ui/ProgressSteps";

export default function SetupCompletePage() {
  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <ProgressSteps
          steps={["Vault Setup", "Create Plan", "Complete"]}
          currentStep={3}
        />

        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-navy mb-3">
            You&apos;re All Set!
          </h1>
          <p className="text-text-secondary text-lg max-w-md mx-auto">
            Your crypto legacy plan is now active and protecting your assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <Card padding="md" className="text-center">
            <Shield className="w-8 h-8 text-gold mx-auto mb-3" />
            <h3 className="font-semibold text-text-primary mb-1">
              Vault Secured
            </h3>
            <p className="text-sm text-text-secondary">
              Key split into 3 shards
            </p>
          </Card>
          <Card padding="md" className="text-center">
            <Users className="w-8 h-8 text-info mx-auto mb-3" />
            <h3 className="font-semibold text-text-primary mb-1">
              Heirs Assigned
            </h3>
            <p className="text-sm text-text-secondary">
              Your contacts will be notified
            </p>
          </Card>
          <Card padding="md" className="text-center">
            <Clock className="w-8 h-8 text-success mx-auto mb-3" />
            <h3 className="font-semibold text-text-primary mb-1">
              Plan Active
            </h3>
            <p className="text-sm text-text-secondary">
              Check-in schedule is running
            </p>
          </Card>
        </div>

        <div className="mt-10 text-center">
          <Link href="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
