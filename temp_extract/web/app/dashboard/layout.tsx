"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Bell, Bookmark, BarChart2, Building2, Settings, Dot,
} from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";
import { api, type UserProfile } from "@/lib/api";

const NAV = [
  { href: "/dashboard",            label: "Feed",       icon: Home },
  { href: "/dashboard/alerts",     label: "Alerts",     icon: Bell },
  { href: "/dashboard/saved",      label: "Saved RFPs", icon: Bookmark },
  { href: "/dashboard/analytics",  label: "Analytics",  icon: BarChart2 },
  { href: "/dashboard/categories", label: "Categories", icon: Building2 },
  { href: "/dashboard/settings",   label: "Settings",   icon: Settings },
];

function NavLink({ href, label, icon: Icon }: (typeof NAV)[number]) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        active
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    api.getProfile().then(setProfile).catch(() => {});
  }, []);

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : profile?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Left nav */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <Dot className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">DealScout</span>
            <span className="rounded bg-indigo-100 dark:bg-indigo-950 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">AI</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => <NavLink key={item.href} {...item} />)}
        </nav>

        {/* User */}
        {profile && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{profile.name ?? "User"}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{profile.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-12 shrink-0 flex items-center justify-end gap-2 px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <NotificationBell />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
