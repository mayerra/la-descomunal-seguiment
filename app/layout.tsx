import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seguiment La Descomunal",
  description: "Quadre de seguiment dels nou projectes de La Descomunal 2026-2028.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca">
      <body className="antialiased">{children}</body>
    </html>
  );
}
