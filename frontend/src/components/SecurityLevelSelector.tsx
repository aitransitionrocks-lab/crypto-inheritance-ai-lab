"use client";

import React from "react";
import { Shield, Lock, Key, CheckCircle } from "lucide-react";

export type SecurityLevel = "basic" | "standard" | "maximum";

interface SecurityLevelSelectorProps {
  value: SecurityLevel;
  onChange: (level: SecurityLevel) => void;
}

const levels: {
  id: SecurityLevel;
  name: string;
  price: string;
  icon: React.ElementType;
  color: string;
  recommended: boolean;
  features: string[];
}[] = [
  {
    id: "basic",
    name: "Basic",
    price: "Free",
    icon: Key,
    color: "#22c55e",
    recommended: false,
    features: [
      "Email check-in",
      "Simple shard split",
      "90-day minimum trigger",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: "Pro",
    icon: Shield,
    color: "#c9a84c",
    recommended: true,
    features: [
      "2FA authentication",
      "Shamir 2-of-3 splitting",
      "Custom trigger intervals",
      "SMS check-in",
    ],
  },
  {
    id: "maximum",
    name: "Maximum",
    price: "Enterprise",
    icon: Lock,
    color: "#3b82f6",
    recommended: false,
    features: [
      "Hardware key support",
      "Multi-party verification",
      "Timelock encryption",
      "Full audit trail",
    ],
  },
];

export default function SecurityLevelSelector({
  value,
  onChange,
}: SecurityLevelSelectorProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-6">
      <h2 className="text-lg font-semibold text-[#1a2332] mb-2">
        Security Level
      </h2>
      <p className="text-sm text-[#64748b] mb-5">
        Choose the protection level that fits your needs.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {levels.map((level) => {
          const isSelected = value === level.id;
          return (
            <button
              key={level.id}
              type="button"
              onClick={() => onChange(level.id)}
              className={`relative text-left p-5 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? "border-[#c9a84c] bg-[#c9a84c]/5 shadow-md"
                  : "border-[#e2e8f0] bg-[#f8fafc] hover:border-[#cbd5e1]"
              }`}
            >
              {level.recommended && (
                <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 bg-[#c9a84c] text-white text-xs font-bold rounded-full">
                  Recommended
                </span>
              )}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: `${level.color}15` }}
              >
                <level.icon
                  className="w-5 h-5"
                  style={{ color: level.color }}
                />
              </div>
              <div className="font-bold text-[#1a2332] text-sm mb-0.5">
                {level.name}
              </div>
              <div
                className="text-xs font-semibold mb-3"
                style={{ color: level.color }}
              >
                {level.price}
              </div>
              <ul className="space-y-1.5">
                {level.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-1.5 text-xs text-[#64748b]"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#22c55e] mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}
