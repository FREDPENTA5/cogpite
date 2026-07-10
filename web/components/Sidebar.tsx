"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, Bookmark, FileText, Bell, 
  Settings, CreditCard, Tag, LogOut, Menu, X
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Feed", href: "/dashboard", icon: <FileText size={18} /> },
  { label: "Saved RFPs", href: "/dashboard/saved", icon: <Bookmark size={18} /> },
  { label: "Analytics", href: "/dashboard/analytics", icon: <Activity size={18} /> },
  { label: "Alerts", href: "/dashboard/alerts", icon: <Bell size={18} /> },
  { label: "Categories", href: "/dashboard/categories", icon: <Tag size={18} /> },
];

const BOTTOM_NAV_ITEMS = [
  { label: "Settings", href: "/dashboard/settings", icon: <Settings size={18} /> },
  { label: "Billing", href: "/billing", icon: <CreditCard size={18} /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo">
          DealScout AI
        </div>

        <nav className="nav" style={{ flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive(item.href) ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="nav" style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-4)" }}>
          {BOTTOM_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive(item.href) ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          
          <button className="nav-item" style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}>
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
