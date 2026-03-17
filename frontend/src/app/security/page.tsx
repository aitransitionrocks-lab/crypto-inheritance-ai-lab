"use client";

import React from "react";
import {
  Shield,
  Smartphone,
  UserCheck,
  Vault,
  CheckCircle,
  XCircle,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";

const shardLocations = [
  {
    icon: Smartphone,
    title: "Your Device",
    status: "Stored securely",
    color: "text-info",
    bg: "bg-blue-50",
  },
  {
    icon: UserCheck,
    title: "Trusted Contact",
    status: "Distributed",
    color: "text-success",
    bg: "bg-green-50",
  },
  {
    icon: Vault,
    title: "LegacyGuard Vault",
    status: "Encrypted storage",
    color: "text-gold",
    bg: "bg-amber-50",
  },
];

const canAccess = [
  "Your encrypted shard (1 of 3, useless alone)",
  "Your plan configuration and heir list",
  "Check-in timestamps",
];

const cannotAccess = [
  "Your private keys or seed phrases",
  "Your crypto wallet balances",
  "Your complete encryption key",
  "Your funds in any way",
];

export default function SecurityPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Security &amp; Trust
        </h1>
        <p className="text-text-secondary mb-8">
          Understand how LegacyGuard protects your assets.
        </p>

        {/* Security Score */}
        <Card padding="lg" className="mb-8 text-center">
          <Shield className="w-16 h-16 text-success mx-auto mb-4" />
          <p className="text-sm text-text-secondary mb-1">Security Score</p>
          <p className="text-5xl font-bold text-success mb-2">92</p>
          <p className="text-sm text-text-secondary">Excellent protection</p>
        </Card>

        {/* Shard Visualization */}
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Key Shard Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {shardLocations.map((shard) => {
            const Icon = shard.icon;
            return (
              <Card key={shard.title} padding="md" className="text-center">
                <div
                  className={`w-14 h-14 rounded-full ${shard.bg} flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`w-7 h-7 ${shard.color}`} />
                </div>
                <h3 className="font-semibold text-text-primary mb-1">
                  {shard.title}
                </h3>
                <p className="text-sm text-text-secondary">{shard.status}</p>
              </Card>
            );
          })}
        </div>

        {/* Can / Cannot Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card padding="lg">
            <h3 className="font-semibold text-text-primary mb-4">
              What LegacyGuard CAN access
            </h3>
            <ul className="flex flex-col gap-3">
              {canAccess.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-info mt-0.5 shrink-0" />
                  <span className="text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card padding="lg">
            <h3 className="font-semibold text-text-primary mb-4">
              What LegacyGuard CANNOT access
            </h3>
            <ul className="flex flex-col gap-3">
              {cannotAccess.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <XCircle className="w-4 h-4 text-error mt-0.5 shrink-0" />
                  <span className="text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Last Audit */}
        <Card padding="md" className="bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-info" />
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Last Security Audit
              </p>
              <p className="text-sm text-text-secondary">
                March 2026 by CertiK (placeholder). All systems passed.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
