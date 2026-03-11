"use client";

import { createContext, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAdBySlot } from "@/lib/hooks/useAds";
import { AdDisplay } from "./ad-display";
import { Ad } from "@/types/ads.types";

const INLINE_AD_LIMIT = 4;

type InlineAdContextValue = {
  ads: Ad[];
  isLoading: boolean;
  error: unknown;
};

const InlineAdContext = createContext<InlineAdContextValue | null>(null);

export function InlineAdProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data, isLoading, error } = useAdBySlot("INLINE", INLINE_AD_LIMIT);

  const isAdminRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/advertiser") ||
    pathname?.startsWith("/editor") ||
    pathname?.startsWith("/admin-login");

  const value = useMemo(() => {
    if (isAdminRoute) {
      return { ads: [], isLoading: false, error: null };
    }
    const rawAds = (data as { data?: { ads?: Ad[] } })?.data?.ads ?? [];
    return {
      ads: Array.isArray(rawAds) ? rawAds.slice(0, INLINE_AD_LIMIT) : [],
      isLoading,
      error,
    };
  }, [data, isLoading, error, isAdminRoute]);

  return (
    <InlineAdContext.Provider value={value}>
      {children}
    </InlineAdContext.Provider>
  );
}

export function InlineAdPlacement({ index }: { index: number }) {
  const ctx = useContext(InlineAdContext);
  if (!ctx || ctx.isLoading || ctx.error || index < 0 || index >= ctx.ads.length) {
    return null;
  }
  const ad = ctx.ads[index];
  if (!ad) return null;
  return (
    <div className="flex justify-center w-full my-8 py-4 bg-white border-y border-gray-200">
      <div className="w-full max-w-[728px] min-w-[300px] mx-auto px-4">
        <AdDisplay ad={ad} slot="INLINE" />
      </div>
    </div>
  );
}
