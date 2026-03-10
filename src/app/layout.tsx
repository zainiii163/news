import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import "../styles/cnn-header.css";
import { CNNHeader } from "@/components/ui/cnn-header";
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
          {/* CNN-style Header with Advertisement and Navbar */}
          <CNNHeader />
          
          {/* Main Content */}
          <main style={{ marginTop: '40px' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
