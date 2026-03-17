"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Vault,
  FileText,
  Users,
  Activity,
  Settings,
  Shield,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Vaults", href: "/setup/vault", icon: Vault },
  { label: "Plans", href: "/setup/plan", icon: FileText },
  { label: "Heirs", href: "/setup/plan", icon: Users },
  { label: "Activity", href: "/dashboard", icon: Activity },
  { label: "Settings", href: "/dashboard", icon: Settings },
  { label: "Security", href: "/security", icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-navy text-white flex flex-col">
      <div className="p-6 border-b border-navy-light">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-gold" />
          <span className="text-xl font-bold">LegacyGuard</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-200
                ${
                  isActive
                    ? "bg-navy-light text-gold"
                    : "text-gray-300 hover:bg-navy-light hover:text-white"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-navy-light">
        <p className="text-xs text-gray-400">LegacyGuard v1.0</p>
      </div>
    </aside>
  );
}
