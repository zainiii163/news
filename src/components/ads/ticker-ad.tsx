"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useAdByType } from "@/lib/hooks/useAds";
import { Ad } from "@/types/ads.types";
import { adsApi } from "@/lib/api/modules/ads.api";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/helpers/imageUrl";

export function TickerAd() {
  const pathname = usePathname();
  const [isMounted] = useState(() => typeof window !== "undefined");
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 640
  );
  const [tickerWidth, setTickerWidth] = useState(0);
  const tickerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Fetch both TICKER and SLIDER_TOP ads for the ticker section
  const { data: tickerData, isLoading: tickerLoading, error: tickerError } = useAdByType("TICKER", 5);
  const { isLoading: sliderTopLoading, error: sliderTopError } = useAdByType("SLIDER_TOP", 5);

  // Don't show ads in admin panel, advertiser panel, or editor pages
  // Advertisers CAN see ads on public pages (to see competitors), but NOT in their panel
  const isAdminRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/advertiser") ||
    pathname?.startsWith("/editor") ||
    pathname?.startsWith("/admin-login");

  // Derive selected ads from data - ONLY TICKER ads (not SLIDER_TOP)
  const selectedAds = useMemo(() => {
    // Only show TICKER ads in the ticker section
    if (tickerData?.data?.ads && tickerData.data.ads.length > 0) {
      return tickerData.data.ads.filter((ad) => ad.type === "TICKER");
    }
    return [];
  }, [tickerData]);

  const isLoading = tickerLoading || sliderTopLoading;
  const error = tickerError || sliderTopError;

  // Measure ticker viewport width on mobile so each ad fits exactly (no cut, no clip)
  useEffect(() => {
    if (!tickerRef.current || !isMobile || selectedAds.length === 0) return;
    const el = tickerRef.current;
    const updateWidth = () => setTickerWidth(el.offsetWidth);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile, selectedAds.length]);

  // Create continuous scrolling animation
  useEffect(() => {
    if (!tickerRef.current || selectedAds.length === 0) return;

    const ticker = tickerRef.current;
    const content = ticker.querySelector(".ticker-content") as HTMLElement;
    if (!content) return;

    let position = 0;
    const speed = 1; // pixels per frame
    // Content is duplicated (A B A B), so reset after scrolling half width for seamless loop
    const halfWidth = content.offsetWidth / 2;

    const animate = () => {
      position -= speed;

      // Reset when we've scrolled one full set so the duplicate is in view
      if (Math.abs(position) >= halfWidth) {
        position = 0;
      }

      content.style.transform = `translateX(${position}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedAds]);

  const handleClick = (ad: Ad) => {
    // Track click
    adsApi.trackClick(ad.id).catch((err) => {
      console.error("Failed to track ad click:", err);
    });
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  // Don't show in admin routes only (advertisers can see ads on public pages)
  if (isAdminRoute || isLoading || error || selectedAds.length === 0) {
    return null;
  }

  // Duplicate ads for seamless loop
  const duplicatedAds = [...selectedAds, ...selectedAds];

  // On mobile: banner aspect ratio (728:90) so full image shows without cropping; track height follows content
  const MOBILE_GAP_PX = 12;
  const mobileItemWidthPx = isMobile ? "calc(100vw - 12px)" : undefined;

  return (
    <div
      className="w-full bg-gray-100 text-gray-900 overflow-hidden"
      style={
        isMobile
          ? { width: "100vw", marginLeft: "calc(-50vw + 50%)" }
          : undefined
      }
    >
      <div
        ref={tickerRef}
        className="relative flex items-center overflow-hidden w-full sm:h-[90px] sm:min-h-[90px]"
        style={isMobile ? { height: "auto", minHeight: 0 } : undefined}
      >
        <div
          className="ticker-content flex items-center gap-5 whitespace-nowrap w-max sm:h-[90px]"
          style={
            isMobile
              ? { gap: `${MOBILE_GAP_PX}px`, alignItems: "stretch" }
              : undefined
          }
        >
          {duplicatedAds.map((ad, index) => {
            const adContent = (
              <div
                className="relative flex-shrink-0 overflow-hidden bg-gray-50 rounded-md border border-gray-200/80 sm:border-0 sm:w-[728px] sm:min-w-[728px] sm:h-[90px]"
                style={
                  isMobile && mobileItemWidthPx
                    ? {
                        width: mobileItemWidthPx,
                        minWidth: mobileItemWidthPx,
                        aspectRatio: "728/90",
                      }
                    : undefined
                }
              >
                {ad.imageUrl && ad.imageUrl.trim() !== "" ? (
                  <Image
                    src={getImageUrl(ad.imageUrl)}
                    alt={ad.title}
                    width={728}
                    height={90}
                    className="object-cover w-full h-full object-center"
                    quality={85}
                    loading="lazy"
                    unoptimized={
                      getImageUrl(ad.imageUrl).includes("localhost") ||
                      getImageUrl(ad.imageUrl).includes("127.0.0.1") ||
                      getImageUrl(ad.imageUrl).includes("api.tgcalabriareport.com")
                    }
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-xs text-gray-500">No image</p>
                  </div>
                )}
              </div>
            );

            // Only wrap in Link if targetLink exists
            if (ad.targetLink && ad.targetLink.trim() !== "") {
              return (
                <Link
                  key={`${ad.id}-${index}`}
                  href={ad.targetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleClick(ad)}
                  className="flex items-center gap-0 sm:gap-4 px-0 sm:px-8 hover:opacity-90 active:opacity-75 transition-opacity flex-shrink-0 touch-manipulation text-gray-900"
                >
                  {adContent}
                </Link>
              );
            }

            // Render without link if no targetLink
            return (
              <div
                key={`${ad.id}-${index}`}
                className="flex items-center gap-0 sm:gap-4 px-0 sm:px-8 flex-shrink-0"
              >
                {adContent}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
