"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const config: Record<ToastType, { bg: string; border: string; text: string; icon: typeof CheckCircle }> = {
  success: { bg: "#22c55e", border: "#16a34a", text: "#ffffff", icon: CheckCircle },
  error: { bg: "#ef4444", border: "#dc2626", text: "#ffffff", icon: XCircle },
  info: { bg: "#3b82f6", border: "#2563eb", text: "#ffffff", icon: Info },
};

export default function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const { bg, border, text, icon: Icon } = config[type];

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg transition-all duration-300 max-w-sm"
      style={{
        backgroundColor: bg,
        borderLeft: `4px solid ${border}`,
        color: text,
        transform: visible ? "translateX(0)" : "translateX(120%)",
        opacity: visible ? 1 : 0,
      }}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="p-0.5 rounded hover:opacity-80 transition-opacity cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
