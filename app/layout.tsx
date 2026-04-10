import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../src/styles/cnn-header-complete.css";
import "../src/styles/cnn-homepage.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { ArticleChromeProvider } from "@/providers/ArticleChromeProvider";
import { ToastProvider } from "@/components/ui/toast";
import { BreakingNewsManager } from "@/components/notifications/breaking-news-manager";
import { BehaviorTracker } from "@/components/analytics/behavior-tracker";
import { AdsWrapper } from "@/components/ads/ads-wrapper";
import { ErrorBoundary } from "@/components/error-boundary";
import { CNNHeaderExact } from "@/components/ui/cnn-header-exact";
import { MainContent } from "@/components/ui/main-content";
import { MegaFooter } from "@/components/ui/mega-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevent invisible text during font load
  preload: true,
  fallback: ["system-ui", "arial"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Prevent invisible text during font load
  preload: false, // Only preload primary font
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  title: " Tg Calabria - Edizione Calabria",
  description: "Next-generation digital news platform for Calabria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FFFFFF] text-[#0A0A0A] overflow-x-clip max-w-full`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <QueryProvider>
            <LanguageProvider>
              <AuthProvider>
                <ToastProvider>
                  <ArticleChromeProvider>
                    <BehaviorTracker>
                      <AdsWrapper />
                      <BreakingNewsManager />
                      <div className="min-h-screen bg-[#FFFFFF]">
                        <CNNHeaderExact />
                        <MainContent>
                          {children}
                        </MainContent>
                        <MegaFooter />
                      </div>
                    </BehaviorTracker>
                  </ArticleChromeProvider>
                </ToastProvider>
              </AuthProvider>
            </LanguageProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
