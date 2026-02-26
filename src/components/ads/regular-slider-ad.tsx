"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAdByType } from "@/lib/hooks/useAds";
import { AdDisplay } from "./ad-display";
import { Ad } from "@/types/ads.types";

/**
 * RegularSliderAd - Displays regular SLIDER ads (not SLIDER_TOP)
 * This component is separate from SliderAd which handles SLIDER_TOP
 */
export function RegularSliderAd() {
  const pathname = usePathname();
  // Fetch only SLIDER ads (not SLIDER_TOP)
  const { data: sliderData, isLoading: sliderLoading, error: sliderError } = useAdByType("SLIDER", 5) as { data: { ads: Ad[] } | undefined; isLoading: boolean; error: any };
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Don't show ads in admin panel, advertiser panel, or editor pages
  const isAdminRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/advertiser") ||
    pathname?.startsWith("/editor") ||
    pathname?.startsWith("/admin-login");

  // Only show regular SLIDER ads (not SLIDER_TOP)
  const selectedAds = useMemo(() => {
    if (sliderData?.ads && sliderData.ads.length > 0) {
      return sliderData.ads.filter((ad: Ad) => ad.type === "SLIDER");
    }
    return [];
  }, [sliderData]);

  const isLoading = sliderLoading;
  const error = sliderError;

  // Auto-rotate ads every 3 seconds
  useEffect(() => {
    if (selectedAds.length <= 1 || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % selectedAds.length);
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [selectedAds.length, isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + selectedAds.length) % selectedAds.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % selectedAds.length);
  };

  // Don't show in admin routes only (advertisers can see ads on public pages)
  if (isAdminRoute || isLoading || error || selectedAds.length === 0) {
    return null;
  }

  const currentAd = selectedAds[currentIndex];

  return (
    <div
      className="relative w-full max-w-[1920px] mx-auto overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-md bg-gray-100">
        <AdDisplay ad={currentAd} slot="MID_PAGE" />
      </div>

      {/* Navigation arrows */}
      {selectedAds.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1.5 sm:p-2 hover:bg-opacity-75 active:bg-opacity-90 transition-all z-10 touch-manipulation"
            aria-label="Previous ad"
          >
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1.5 sm:p-2 hover:bg-opacity-75 active:bg-opacity-90 transition-all z-10 touch-manipulation"
            aria-label="Next ad"
          >
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Navigation dots */}
      {selectedAds.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {selectedAds.map((_: Ad, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white bg-opacity-50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
