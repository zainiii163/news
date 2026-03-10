"use client";

import { AdSlot } from "@/components/ads/ad-slot";

interface AdBannerProps {
  type: "horizontal" | "sidebar";
  slot?: "SIDEBAR" | "MID_PAGE" | "BETWEEN_SECTIONS_1" | "BETWEEN_SECTIONS_2" | "BETWEEN_SECTIONS_3";
  title?: string;
  className?: string;
}

export function AdBanner({ 
  type, 
  slot = "BETWEEN_SECTIONS_1", 
  title, 
  className = "" 
}: AdBannerProps) {
  // Don't show ads on admin routes
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    const isAdminRoute = pathname?.startsWith("/admin") || 
                        pathname?.startsWith("/advertiser") || 
                        pathname?.startsWith("/editor");
    
    if (isAdminRoute) return null;
  }

  // Horizontal Banner Layout
  if (type === "horizontal") {
    return (
      <div className={`w-full py-4 md:py-6 ${className}`}>
        {title && (
          <div className="mb-3 text-center">
            <span 
              className="text-xs text-gray-400 uppercase tracking-wider font-medium"
              style={{
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {title}
            </span>
          </div>
        )}
        <div className="w-full max-w-6xl mx-auto">
          <AdSlot slot={slot} />
        </div>
      </div>
    );
  }

  // Sidebar Banner Layout
  return (
    <div className={`w-full ${className}`}>
      {title && (
        <div className="mb-3 text-center">
          <span 
            className="text-xs text-gray-400 uppercase tracking-wider font-medium"
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </span>
        </div>
      )}
      <div 
        className="w-full"
        style={{
          borderLeft: '1px solid #e6e6e6',
          paddingLeft: '16px',
        }}
      >
        <AdSlot slot={slot} />
      </div>
    </div>
  );
}
