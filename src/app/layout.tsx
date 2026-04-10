import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TG Calabria - News",
  description: "Latest news from Calabria and around the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* Header + ads: use root app/layout.tsx (CNNHeaderExact + AdsWrapper). Avoid duplicate nav here. */}
          <main style={{ marginTop: "0" }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
