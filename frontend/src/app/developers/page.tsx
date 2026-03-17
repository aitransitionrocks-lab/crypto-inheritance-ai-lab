import React from "react";
import { Code, Terminal } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";

const endpoints = [
  { method: "GET", path: "/api/plans", description: "List all plans" },
  { method: "POST", path: "/api/plans", description: "Create a new plan" },
  { method: "GET", path: "/api/plans/:id", description: "Get plan details" },
  { method: "PUT", path: "/api/plans/:id", description: "Update a plan" },
  { method: "DELETE", path: "/api/plans/:id", description: "Delete a plan" },
  { method: "POST", path: "/api/plans/:id/heirs", description: "Add heir to plan" },
  { method: "POST", path: "/api/checkins", description: "Perform check-in" },
  { method: "POST", path: "/api/vaults", description: "Create a vault" },
  { method: "GET", path: "/api/vaults/:id", description: "Get vault details" },
];

const curlExample = `curl -X POST http://localhost:8000/api/plans \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Family Legacy Plan",
    "trigger_days": 90,
    "check_in_method": "email"
  }'`;

const methodColors: Record<string, string> = {
  GET: "bg-green-100 text-green-800",
  POST: "bg-blue-100 text-blue-800",
  PUT: "bg-amber-100 text-amber-800",
  DELETE: "bg-red-100 text-red-800",
};

export default function DevelopersPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Developer Portal
        </h1>
        <p className="text-text-secondary mb-8">
          Integrate LegacyGuard into your application using our REST API.
        </p>

        {/* Endpoints */}
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Code className="w-5 h-5" /> API Endpoints
        </h2>
        <Card padding="none" className="mb-8">
          <div className="divide-y divide-border">
            {endpoints.map((ep) => (
              <div
                key={`${ep.method}-${ep.path}`}
                className="flex items-center gap-4 px-6 py-3"
              >
                <span
                  className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${methodColors[ep.method]}`}
                >
                  {ep.method}
                </span>
                <code className="text-sm font-mono text-navy flex-1">
                  {ep.path}
                </code>
                <span className="text-sm text-text-secondary">
                  {ep.description}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Code Example */}
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5" /> Example Request
        </h2>
        <Card padding="none" className="mb-8">
          <div className="bg-navy rounded-xl p-6 overflow-x-auto">
            <pre className="text-sm font-mono text-green-400 whitespace-pre">
              {curlExample}
            </pre>
          </div>
        </Card>

        <Card padding="md" className="bg-amber-50 border-amber-200 text-center">
          <p className="text-sm text-text-secondary">
            Full API documentation coming soon. Contact{" "}
            <span className="font-semibold text-text-primary">
              developers@legacyguard.io
            </span>{" "}
            for early access.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
