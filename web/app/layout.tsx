import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "DealScout AI", template: "%s · DealScout AI" },
  description: "RFP intelligence for East African ICT firms",
};

import { ToastProvider } from "@/components/ui/Toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
