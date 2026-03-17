import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
