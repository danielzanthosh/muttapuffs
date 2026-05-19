import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MuttaMeter | Find Legendary Puffs",
  description: "Community-powered bakery discovery platform focused on Kerala bakery culture and mutta puffs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-[100dvh] flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
