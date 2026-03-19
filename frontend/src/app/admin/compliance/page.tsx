"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  Scale,
  CheckCircle,
  Clock,
  AlertTriangle,
  Globe,
  Lock,
  FileText,
  ArrowRight,
} from "lucide-react";

type ComplianceStatus = "Compliant" | "In Progress" | "Not Started";

const statusStyles: Record<ComplianceStatus, { bg: string; text: string }> = {
  Compliant: { bg: "bg-[#22c55e]/10", text: "text-[#22c55e]" },
  "In Progress": { bg: "bg-[#f59e0b]/10", text: "text-[#f59e0b]" },
  "Not Started": { bg: "bg-[#94a3b8]/10", text: "text-[#94a3b8]" },
};

function StatusIcon({ status }: { status: ComplianceStatus }) {
  if (status === "Compliant") return <CheckCircle className="w-4 h-4 text-[#22c55e]" />;
  if (status === "In Progress") return <Clock className="w-4 h-4 text-[#f59e0b]" />;
  return <AlertTriangle className="w-4 h-4 text-[#94a3b8]" />;
}

const jurisdictions: {
  name: string;
  regulation: string;
  status: ComplianceStatus;
  notes: string;
}[] = [
  {
    name: "United States",
    regulation: "FinCEN / SEC guidelines on digital assets",
    status: "In Progress",
    notes: "Non-custodial architecture avoids MSB classification. Legal review ongoing.",
  },
  {
    name: "European Union",
    regulation: "MiCA (Markets in Crypto-Assets Regulation)",
    status: "In Progress",
    notes: "Monitoring MiCA implementation timeline. GDPR compliance confirmed.",
  },
  {
    name: "Switzerland",
    regulation: "FINMA DLT Framework",
    status: "Compliant",
    notes: "Non-custodial services not subject to FINMA licensing. Legal opinion obtained.",
  },
  {
    name: "Singapore",
    regulation: "MAS Payment Services Act",
    status: "Not Started",
    notes: "Assessment planned for Q3 2026. Non-custodial exemption expected.",
  },
  {
    name: "United Kingdom",
    regulation: "FCA Cryptoasset Registration",
    status: "Not Started",
    notes: "UK expansion planned for Q4 2026. Regulatory landscape under review.",
  },
];

const dataProtectionChecklist: { item: string; status: ComplianceStatus }[] = [
  { item: "GDPR-compliant data processing agreements", status: "Compliant" },
  { item: "Data encryption at rest (AES-256-GCM)", status: "Compliant" },
  { item: "Data encryption in transit (TLS 1.3)", status: "Compliant" },
  { item: "Right to erasure implementation", status: "In Progress" },
  { item: "Data breach notification procedure", status: "Compliant" },
  { item: "Privacy impact assessment", status: "Compliant" },
];

const custodyChecklist: { item: string; status: ComplianceStatus }[] = [
  { item: "Non-custodial architecture documentation", status: "Compliant" },
  { item: "Shamir Secret Sharing (2-of-3 threshold)", status: "Compliant" },
  { item: "Independent security audit (CertiK)", status: "Compliant" },
  { item: "Client-side key generation verification", status: "Compliant" },
  { item: "No private key storage attestation", status: "In Progress" },
];

const licensingChecklist: { item: string; status: ComplianceStatus }[] = [
  { item: "Non-custodial exemption legal opinions", status: "In Progress" },
  { item: "AML/KYC policy documentation", status: "Compliant" },
  { item: "Terms of Service regulatory review", status: "Compliant" },
  { item: "Cross-border service assessment", status: "Not Started" },
  { item: "SOC 2 Type II certification", status: "In Progress" },
];

function ChecklistSection({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: React.ElementType;
  items: { item: string; status: ComplianceStatus }[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
      <h3 className="text-lg font-bold text-[#1a2332] mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-[#c9a84c]" />
        {title}
      </h3>
      <div className="flex flex-col gap-3">
        {items.map((ci) => {
          const style = statusStyles[ci.status];
          return (
            <div
              key={ci.item}
              className="flex items-center justify-between py-2 border-b border-[#f1f5f9] last:border-0"
            >
              <div className="flex items-center gap-2">
                <StatusIcon status={ci.status} />
                <span className="text-sm text-[#1a2332]">{ci.item}</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${style.bg} ${style.text}`}
              >
                {ci.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0]">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-[#c9a84c]" />
          <span className="text-xl font-bold text-[#1a2332]">LegacyGuard</span>
        </Link>
        <span className="text-sm font-medium text-[#64748b]">
          Admin &middot; Compliance
        </span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-6 h-6 text-[#c9a84c]" />
            <h1 className="text-2xl font-bold text-[#1a2332]">
              Compliance Dashboard
            </h1>
          </div>
          <p className="text-[#64748b]">
            Regulatory compliance status across jurisdictions and operational
            areas.
          </p>
        </div>

        {/* Jurisdiction Table */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] mb-8 overflow-hidden">
          <div className="p-6 border-b border-[#e2e8f0]">
            <h2 className="text-lg font-bold text-[#1a2332] flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#3b82f6]" />
              Jurisdictions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f8fafc] text-left">
                  <th className="px-6 py-3 font-semibold text-[#64748b]">
                    Jurisdiction
                  </th>
                  <th className="px-6 py-3 font-semibold text-[#64748b]">
                    Key Regulation
                  </th>
                  <th className="px-6 py-3 font-semibold text-[#64748b]">
                    Status
                  </th>
                  <th className="px-6 py-3 font-semibold text-[#64748b]">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {jurisdictions.map((j) => {
                  const style = statusStyles[j.status];
                  return (
                    <tr
                      key={j.name}
                      className="border-t border-[#f1f5f9] hover:bg-[#f8fafc]"
                    >
                      <td className="px-6 py-4 font-semibold text-[#1a2332] whitespace-nowrap">
                        {j.name}
                      </td>
                      <td className="px-6 py-4 text-[#64748b]">
                        {j.regulation}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${style.bg} ${style.text}`}
                        >
                          <StatusIcon status={j.status} />
                          {j.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#64748b] text-xs max-w-[250px]">
                        {j.notes}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Checklists */}
        <div className="flex flex-col gap-6 mb-8">
          <ChecklistSection
            title="Data Protection"
            icon={Lock}
            items={dataProtectionChecklist}
          />
          <ChecklistSection
            title="Custody Classification"
            icon={Shield}
            items={custodyChecklist}
          />
          <ChecklistSection
            title="Licensing Status"
            icon={FileText}
            items={licensingChecklist}
          />
        </div>

        {/* Footer */}
        <div className="bg-[#f59e0b]/5 border border-[#f59e0b]/20 rounded-2xl p-5 text-center mb-8">
          <p className="text-sm text-[#92400e]">
            This dashboard is for internal use. Consult legal counsel for
            regulatory decisions.
          </p>
        </div>

        <div className="text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#1a2332] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
