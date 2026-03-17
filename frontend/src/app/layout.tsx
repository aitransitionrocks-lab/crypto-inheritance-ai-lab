import type { Metadata } from "next";
import "./globals.css";
import FeedbackWidget from "@/components/FeedbackWidget";

export const metadata: Metadata = {
  title: "LegacyGuard - Protect Your Crypto Legacy",
  description: "Secure crypto inheritance planning with Shamir Secret Sharing",
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
      </body>
    </html>
  );
}
