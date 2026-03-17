import type { Metadata } from "next";
import "./globals.css";
import FeedbackWidget from "@/components/FeedbackWidget";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "LegacyGuard — Protect Your Crypto Legacy",
  description:
    "Non-custodial crypto inheritance protocol. Ensure your digital assets reach your family.",
  openGraph: {
    title: "LegacyGuard — Protect Your Crypto Legacy",
    description:
      "Non-custodial crypto inheritance protocol. Ensure your digital assets reach your family.",
    siteName: "LegacyGuard",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LegacyGuard — Protect Your Crypto Legacy",
    description:
      "Non-custodial crypto inheritance protocol. Ensure your digital assets reach your family.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <FeedbackWidget />
        <CookieBanner />
      </body>
    </html>
  );
}
