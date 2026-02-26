"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAdBySlot } from "@/lib/hooks/useAds";
import { AdDisplay } from "./ad-display";
import { AdContainer } from "./ad-container";
import { LoadingSpinner } from "@/components/ui/loading";
import {
  selectAdForRotation,
  getCachedAd,
  cacheSelectedAd,
} from "@/lib/helpers/ad-rotation";
import { Ad, AdResponse } from "@/types/ads.types";

interface AdSlotProps {
  slot:
    | "HEADER"
    | "SIDEBAR"
    | "INLINE"
    | "FOOTER"
    | "MOBILE"
    | "TOP_BANNER"
    | "MID_PAGE"
    | "BETWEEN_SECTIONS"
    | "BETWEEN_SECTIONS_1"
    | "BETWEEN_SECTIONS_2"
    | "BETWEEN_SECTIONS_3";
  className?: string;
}

export function AdSlot({ slot, className = "" }: AdSlotProps) {
  const pathname = usePathname();
  // Fetch up to 2 ads for inline display when space allows
  const { data, isLoading, error } = useAdBySlot(slot, 2) as { data: AdResponse | undefined; isLoading: boolean; error: unknown };
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [allAds, setAllAds] = useState<Ad[]>([]);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [isMounted] = useState(() => typeof window !== "undefined");

  // Don't show ads in admin panel, advertiser panel, or editor pages
  // Advertisers CAN see ads on public pages (to see competitors), but NOT in their panel
  const isAdminRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/advertiser") ||
    pathname?.startsWith("/editor") ||
    pathname?.startsWith("/admin-login");

  // Handle mobile detection on client side only to avoid hydration mismatch
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Compute filtered ads
  const filteredAds = useMemo(() => {
    if (data?.data?.ads && data.data.ads.length > 0) {
      let ads = data.data.ads;

      // Filter out BANNER_TOP ads from non-TOP_BANNER slots
      // BANNER_TOP ads should only appear in TOP_BANNER slot
      if (slot !== "TOP_BANNER" && slot !== "HEADER") {
        ads = ads.filter((ad: Ad) => ad.type !== "BANNER_TOP");
      }

      return ads;
    }
    return [];
  }, [data, slot]);

  // Update ads when filtered ads change
  useEffect(() => {
    // Use setTimeout to defer state updates
    const timer = setTimeout(() => {
      if (filteredAds.length > 0) {
        setAllAds(filteredAds);

        // For single ad display (backward compatibility), use rotation
        if (filteredAds.length === 1) {
          setSelectedAd(filteredAds[0]);
        } else {
          // Check if we have a cached ad for this slot
          const cachedAdId = getCachedAd(slot);
          const cachedAd = cachedAdId
            ? filteredAds.find((ad: Ad) => ad.id === cachedAdId)
            : null;

          if (cachedAd) {
            setSelectedAd(cachedAd);
          } else {
            // Select a new ad and cache it (for single ad fallback)
            const ad = selectAdForRotation(filteredAds);
            if (ad) {
              setSelectedAd(ad);
              cacheSelectedAd(slot, ad.id);
            }
          }
        }
      } else {
        setAllAds([]);
        setSelectedAd(null);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [filteredAds, slot]);

  // Handle mobile-specific slots - only check after mount
  const shouldShowMobile = slot !== "MOBILE" || (isMounted && isMobile);

  // Don't show ads in admin routes only (advertisers can see ads on public pages)
  if (isAdminRoute || !shouldShowMobile) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[100px]">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (error || !data?.data?.ads || data.data.ads.length === 0) {
    return null; // Don't show anything if no ads
  }

  // Use AdContainer for multiple ads, single AdDisplay for single ad
  const isSidebar = slot === "SIDEBAR" || slot === "MOBILE";
  const wrapperClasses = isSidebar
    ? className
    : `flex justify-center w-full ${className}`.trim();

  // Slots that show ALL ads returned by API (no rotation): FOOTER, SIDEBAR, MOBILE, TOP_BANNER
  const rawAds = (data as { data?: { ads?: Ad[] } })?.data?.ads ?? [];
  const showAllSlots = ["FOOTER", "SIDEBAR", "MOBILE", "TOP_BANNER"] as const;
  const isShowAllSlot = showAllSlots.includes(slot as (typeof showAllSlots)[number]);
  // For show-all slots, use full list from API so every returned ad is shown
  const rawList = isShowAllSlot && rawAds.length > 0 ? [...rawAds] : null;

  const adsToRender =
    rawList !== null ? rawList : filteredAds.length > 0 ? filteredAds : allAds;
  const hasMultipleAds = !isShowAllSlot && adsToRender.length > 1;

  // FOOTER/SIDEBAR/MOBILE: always use AdContainer with full list so every ad from API is shown
  if (isShowAllSlot && rawList && rawList.length > 0) {
    return (
      <div className={wrapperClasses}>
        <AdContainer ads={rawList} slot={slot} />
      </div>
    );
  }

  // Other slots with 2+ ads: use AdContainer
  if (hasMultipleAds) {
    return (
      <div className={wrapperClasses}>
        <AdContainer ads={adsToRender} slot={slot} />
      </div>
    );
  }

  // Single ad display (backward compatibility)
  const singleAd = selectedAd ?? adsToRender[0];
  if (singleAd) {
    return (
      <div className={wrapperClasses}>
        <AdDisplay ad={singleAd} className="" slot={slot} />
      </div>
    );
  }

  return null;
}
