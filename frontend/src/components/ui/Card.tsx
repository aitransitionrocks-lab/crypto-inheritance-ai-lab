import React from "react";

type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  children: React.ReactNode;
  padding?: CardPadding;
  className?: string;
  hover?: boolean;
}

const paddingClasses: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  padding = "md",
  className = "",
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
        bg-surface rounded-xl border border-border shadow-sm
        ${hover ? "transition-shadow hover:shadow-md cursor-pointer" : ""}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
