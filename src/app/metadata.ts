import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SwifttDrop - Fast Reliable Transparent Delivery",
  description: "Professional logistics and delivery service. Book via WhatsApp, get paid instantly, track in real-time. Join as a merchant or become a rider today.",
  keywords: "delivery service, logistics, WhatsApp booking, real-time tracking, merchant services, rider registration, Kenya delivery",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SwifttDrop",
  },
  openGraph: {
    title: "SwifttDrop - Fast Reliable Transparent Delivery",
    description: "Professional logistics and delivery service. Book via WhatsApp, get paid instantly, track in real-time.",
    type: "website",
  },
};
