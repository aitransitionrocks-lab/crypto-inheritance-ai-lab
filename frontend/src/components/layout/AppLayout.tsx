"use client";

import React from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import { Bell, User } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-bg">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 md:px-8">
          <h2 className="text-lg font-semibold text-text-primary">
            LegacyGuard
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <Bell className="w-5 h-5 text-text-secondary" />
            </button>
            <button className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center cursor-pointer">
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
