"use client";

import { useState, useEffect } from "react";
import { Ad } from "@/types/ads.types";
import { AdDisplay } from "./ad-display";

interface AdContainerProps {
  ads: Ad[];
  slot?:
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

export function AdContainer({ ads, slot, className = "" }: AdContainerProps) {
  const [windowWidth, setWindowWidth] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth;
    }
    return 0;
  });
  const [isMounted] = useState(
    () => typeof window !== "undefined"
  );

  // Handle window width tracking on client side only to avoid hydration mismatch
  useEffect(() => {
    const updateWidth = () => {
      if (typeof window !== "undefined") {
        setWindowWidth(window.innerWidth);
      }
    };
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (ads.length === 0) {
    return null;
  }
  // For FOOTER/SIDEBAR/MOBILE/TOP_BANNER render immediately so all ads show (no flash); others wait for mount
  const multiSlot =
    slot === "FOOTER" || slot === "SIDEBAR" || slot === "MOBILE" || slot === "TOP_BANNER";
  if (!isMounted && !(multiSlot && ads.length >= 1)) {
    return null;
  }

  const isSidebar = slot === "SIDEBAR" || slot === "MOBILE";
  const isFooter = slot === "FOOTER";
  const isTopBanner = slot === "TOP_BANNER";
  const isMobile = windowWidth < 768;
  const isDesktop = windowWidth > 1024;

  // For sidebar/mobile with 1+ ads: always stack vertically and show every ad
  if (isSidebar && ads.length >= 1) {
    return (
      <div
        key={`sidebar-${ads.map((a) => a.id).join("-")}`}
        className={`flex flex-col items-center gap-4 w-full ${className}`.trim()}
      >
        {ads.map((ad, index) => (
          <div key={`${ad.id}-${index}`} className="w-full flex justify-center">
            <AdDisplay ad={ad} slot={slot} />
          </div>
        ))}
      </div>
    );
  }

  // For footer ads with 1+ ads: stacked on mobile (one above the other), side-by-side on desktop
  // Use CSS breakpoint so all ads render and layout is correct on first paint (no JS dependency)
  if (isFooter && ads.length >= 1) {
    return (
      <div
        key={`footer-${ads.map((a) => a.id).join("-")}`}
        className={`flex flex-col md:flex-row flex-wrap justify-center items-center md:items-start gap-4 md:gap-3 w-full min-h-0 ${className}`.trim()}
      >
        {ads.map((ad, index) => (
          <div
            key={`${ad.id}-${index}`}
            className="w-full min-w-0 flex justify-center flex-shrink-0 md:flex-shrink-0 md:min-w-[300px] md:max-w-[728px] md:flex-1"
          >
            <AdDisplay ad={ad} slot={slot} />
          </div>
        ))}
      </div>
    );
  }

  // TOP_BANNER with multiple ads: stack or inline
  if (isTopBanner && ads.length >= 1) {
    return (
      <div
        key={`topbanner-${ads.map((a) => a.id).join("-")}`}
        className={`flex flex-col items-center gap-3 md:flex-row md:flex-wrap md:justify-center md:gap-3 w-full ${className}`.trim()}
      >
        {ads.map((ad, index) => (
          <div
            key={`${ad.id}-${index}`}
            className="w-full flex justify-center max-w-[728px] md:flex-1 md:min-w-[300px]"
          >
            <AdDisplay ad={ad} slot={slot} />
          </div>
        ))}
      </div>
    );
  }

  // On desktop (>1024px) and if we have 2+ ads for non-footer slots, show inline
  const shouldShowInline =
    !isMobile && !isSidebar && !isFooter && !isTopBanner && ads.length >= 2 && isDesktop;

  if (shouldShowInline) {
    return (
      <div
        className={`flex flex-wrap justify-center gap-3 ${className}`.trim()}
      >
        {ads.map((ad, index) => (
          <div
            key={`${ad.id}-${index}`}
            className="flex-shrink-0"
            style={{ minWidth: "300px", maxWidth: "728px", width: "100%" }}
          >
            <AdDisplay ad={ad} slot={slot} />
          </div>
        ))}
      </div>
    );
  }

  // Single ad or mobile: center and stack (show every ad)
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`.trim()}>
      {ads.map((ad, index) => (
        <div key={`${ad.id}-${index}`} className="w-full flex justify-center max-w-[728px]">
          <AdDisplay ad={ad} slot={slot} />
        </div>
      ))}
    </div>
  );
}
