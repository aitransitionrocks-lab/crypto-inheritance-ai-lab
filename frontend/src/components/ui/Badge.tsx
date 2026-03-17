import React from "react";

type BadgeStatus = "active" | "warning" | "critical" | "inactive";

interface BadgeProps {
  status: BadgeStatus;
  children: React.ReactNode;
  className?: string;
}

const statusClasses: Record<BadgeStatus, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  critical: "bg-red-100 text-red-800 border-red-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function Badge({
  status,
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${statusClasses[status]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
