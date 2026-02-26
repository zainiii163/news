"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/providers/LanguageProvider";
import { formatDate } from "@/lib/helpers/formatDate";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { WeatherWidget } from "@/components/weather/weather-widget";
import { UtilityLinksDropdown } from "./utility-links-dropdown";

export function UtilityBar() {
  const { language } = useLanguage();
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  // Update date periodically on client side only to avoid hydration mismatch
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="bg-white border-b border-gray-300 text-xs"
      style={{
        position: "relative",
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E6E6E6'
      }}
    >
      <div className="container mx-auto px-2 sm:px-4 lg:px-8 xl:px-12 max-w-7xl" style={{ overflow: "visible" }}>
        <div className="flex items-center justify-between min-h-[32px] sm:h-8 py-1 sm:py-0 flex-wrap gap-1 sm:gap-0">
          {/* Left: Utility Links - appear before date */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <UtilityLinksDropdown />
          </div>

          {/* Right: Date, Language Switcher & Weather */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 flex-wrap">
            {/* Date - shorter format on mobile */}
            <div className="text-gray-600 text-[10px] sm:text-xs whitespace-nowrap" suppressHydrationWarning>
              <span className="hidden sm:inline">
                {formatDate(
                  currentDate || new Date(),
                  language === "it" ? "EEEE, d MMMM yyyy" : "EEEE, MMMM d, yyyy"
                )}
              </span>
              <span className="sm:hidden">
                {formatDate(
                  currentDate || new Date(),
                  language === "it" ? "d MMM yyyy" : "MMM d, yyyy"
                )}
              </span>
            </div>
            <LanguageSwitcher compact />
            <WeatherWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
