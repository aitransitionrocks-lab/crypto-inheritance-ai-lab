"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export default function Input({
  label,
  error,
  helpText,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-2.5 rounded-lg border bg-surface text-text-primary
          placeholder:text-text-muted
          focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold
          transition-colors duration-200
          ${error ? "border-error focus:ring-error focus:border-error" : "border-border"}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-error">{error}</p>}
      {helpText && !error && (
        <p className="text-sm text-text-secondary">{helpText}</p>
      )}
    </div>
  );
}
