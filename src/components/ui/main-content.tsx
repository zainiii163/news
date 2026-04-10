"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface MainContentProps {
  children: React.ReactNode;
}

function isAppChromePath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/advertiser") ||
    pathname.startsWith("/editor") ||
    pathname.startsWith("/admin-login")
  );
}

export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();

  // Don't apply container styling to news detail pages - they handle their own layout
  const isNewsDetailPage = pathname?.startsWith("/news/") && pathname !== "/news";

  // Admin/editor/advertiser: full viewport width (cnn-container is max-width ~1200px centered)
  if (isNewsDetailPage || isAppChromePath(pathname)) {
    return (
      <main className="app-chrome-main min-h-screen w-full max-w-none">
        {children}
      </main>
    );
  }
  
  /* No top padding: header is sticky in normal flow — py-6 top created a visible gap under the nav */
  return (
    <main className="cnn-container min-h-screen pt-0 pb-6">
      {children}
    </main>
  );
}
