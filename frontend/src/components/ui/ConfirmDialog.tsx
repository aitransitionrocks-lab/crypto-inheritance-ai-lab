"use client";

import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export default function ConfirmDialog({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmDialogProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-xl shadow-xl border border-[#e2e8f0] max-w-md w-full mx-4 p-6">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[#f1f5f9] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-[#94a3b8]" />
        </button>

        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: isDangerous ? "#ef444415" : "#3b82f615",
            }}
          >
            <AlertTriangle
              className="w-5 h-5"
              style={{ color: isDangerous ? "#ef4444" : "#3b82f6" }}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1a2332]">{title}</h3>
            <p className="text-sm text-[#64748b] mt-1">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#64748b] bg-[#f1f5f9] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer"
            style={{
              backgroundColor: isDangerous ? "#ef4444" : "#1a2332",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
