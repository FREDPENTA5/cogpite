import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL('https://cogpite.com'),
  applicationName: 'Cogpite',
  title: { default: "Cogpite — AI Procurement & RFP Intelligence for East Africa", template: "%s | Cogpite" },
  description: "Cogpite is an AI-powered RFP intelligence platform for East African ICT firms. Discover, track, and win government tenders across Uganda, Kenya, Rwanda, and Tanzania.",
  keywords: ["government tenders Uganda", "RFP alerts Kenya", "procurement opportunities East Africa", "tender management software", "AI procurement intelligence Africa", "PPDA tenders", "PPOA tenders", "ICT bids Africa"],
  authors: [{ name: 'Cogpite' }],
  creator: 'Cogpite',
  publisher: 'Cogpite',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#07080b' },
    ],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_UG',
    url: 'https://cogpite.com',
    siteName: 'Cogpite',
    title: 'Cogpite — Win More Government ICT Tenders in East Africa',
    description: 'Never miss another RFP. AI-powered procurement intelligence scraping portals like PPDA, PPOA, and RPPA to deliver matching tenders to your inbox.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cogpite — AI Procurement Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cogpite — AI Procurement Intelligence for East Africa',
    description: 'Track and win government tenders across Uganda, Kenya, Rwanda, and Tanzania with AI-powered RFP alerts.',
    images: ['/og-image.png'],
    creator: '@cogpite',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: '#0a0f1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

import { ToastProvider } from "@/components/ui/Toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
