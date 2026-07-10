"use client";

import { Sidebar } from "@/components/Sidebar";
import { ToastProvider } from "@/components/ui/Toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="app">
        <Sidebar />
        <main className="main">{children}</main>
      </div>
    </ToastProvider>
  );
}
