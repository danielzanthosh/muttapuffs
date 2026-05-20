import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MuttaPuffs | Find Legendary Puffs",
  description: "Community-powered bakery discovery platform focused on Kerala bakery culture and mutta puffs.",
  verification: {
    google: "oEUvfbJDORYLuRFpIx9oob55GuGjGM9s8ULX3hN90Iw",
  },
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
      </body>
    </html>
  );
}
