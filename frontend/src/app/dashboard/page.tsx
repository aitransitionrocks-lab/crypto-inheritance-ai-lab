"use client";

import React from "react";
import { Shield, FileText, Clock, CheckCircle, Activity } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const plans = [
  {
    name: "Family Legacy Plan",
    status: "active" as const,
    heirs: 3,
    lastCheckIn: "2 hours ago",
  },
  {
    name: "Business Backup",
    status: "warning" as const,
    heirs: 1,
    lastCheckIn: "15 days ago",
  },
];

const activityLog = [
  { action: "Check-in completed", time: "2 hours ago", icon: CheckCircle },
  { action: "Heir added: Alice Smith", time: "3 days ago", icon: Activity },
  { action: "Plan created: Family Legacy Plan", time: "1 week ago", icon: FileText },
  { action: "Vault secured", time: "1 week ago", icon: Shield },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-text-secondary mt-1">
              Welcome back. Your legacy is protected.
            </p>
          </div>
          <Button size="lg">
            <CheckCircle className="w-5 h-5" /> Check In Now
          </Button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card padding="md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Security Score</p>
                <p className="text-2xl font-bold text-success">92/100</p>
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Active Plans</p>
                <p className="text-2xl font-bold text-text-primary">2</p>
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Next Check-in</p>
                <p className="text-2xl font-bold text-text-primary">
                  28 days
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Plans */}
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Your Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan) => (
            <Card key={plan.name} padding="md" hover>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-text-primary">{plan.name}</h3>
                <Badge status={plan.status}>
                  {plan.status === "active" ? "Active" : "Needs Attention"}
                </Badge>
              </div>
              <div className="flex items-center gap-6 text-sm text-text-secondary">
                <span>{plan.heirs} heirs</span>
                <span>Last check-in: {plan.lastCheckIn}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Activity */}
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Recent Activity
        </h2>
        <Card padding="none">
          <div className="divide-y divide-border">
            {activityLog.map((entry, i) => {
              const Icon = entry.icon;
              return (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <Icon className="w-5 h-5 text-text-muted shrink-0" />
                  <span className="text-sm text-text-primary flex-1">
                    {entry.action}
                  </span>
                  <span className="text-xs text-text-muted">{entry.time}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
