"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();
  
  // Don't apply container styling to news detail pages - they handle their own layout
  const isNewsDetailPage = pathname?.startsWith("/news/") && pathname !== "/news";
  
  if (isNewsDetailPage) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    );
  }
  
  return (
    <main className="cnn-container py-6 min-h-screen">
      {children}
    </main>
  );
}
