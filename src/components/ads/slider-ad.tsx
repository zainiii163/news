"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAdByType } from "@/lib/hooks/useAds";
import { AdDisplay } from "./ad-display";
import { Ad } from "@/types/ads.types";

/**
 * SliderAd (Top Slider) - Displays only SLIDER_TOP ads in a carousel.
 * The normal slider (SLIDER) is rendered separately below via RegularSliderAd.
 */
export function SliderAd() {
  const pathname = usePathname();
  const { data: sliderTopData, isLoading: sliderTopLoading, error: sliderTopError } = useAdByType("SLIDER_TOP", 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isAdminRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/advertiser") ||
    pathname?.startsWith("/editor") ||
    pathname?.startsWith("/admin-login");

  // Top slider: only SLIDER_TOP ads (max 5)
  const selectedAds = useMemo(() => {
    return sliderTopData?.data?.ads?.filter((ad: Ad) => ad.type === "SLIDER_TOP").slice(0, 5) ?? [];
  }, [sliderTopData]);

  const isLoading = sliderTopLoading;
  const error = sliderTopError;

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
      <div className="relative overflow-hidden rounded-sm bg-gray-100">
        <AdDisplay ad={currentAd} slot="MID_PAGE" />
      </div>

      {/* Navigation arrows */}
      {selectedAds.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 rounded-full p-1.5 sm:p-2 hover:bg-white active:bg-white/90 transition-all z-10 touch-manipulation shadow-none"
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
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 rounded-full p-1.5 sm:p-2 hover:bg-white active:bg-white/90 transition-all z-10 touch-manipulation shadow-none"
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
