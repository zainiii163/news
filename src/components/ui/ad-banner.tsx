"use client";

import { useState, useEffect } from "react";

interface AdBannerProps {
  size?: "leaderboard" | "sidebar" | "mobile";
  className?: string;
}

export function AdBanner({ size = "leaderboard", className = "" }: AdBannerProps) {
  const [adLoaded, setAdLoaded] = useState(false);

  const sizeConfig = {
    leaderboard: {
      width: "728px",
      height: "90px",
      className: "w-full max-w-[728px] h-[90px]"
    },
    sidebar: {
      width: "300px", 
      height: "250px",
      className: "w-[300px] h-[250px]"
    },
    mobile: {
      width: "320px",
      height: "100px", 
      className: "w-full max-w-[320px] h-[100px]"
    }
  };

  const config = sizeConfig[size];

  useEffect(() => {
    // Simulate ad loading
    const timer = setTimeout(() => {
      setAdLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`bg-gray-100 border border-gray-300 flex items-center justify-center ${config.className} ${className}`}>
      {adLoaded ? (
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Advertisement</div>
          <div className="bg-gray-200 w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">
              {config.width} × {config.height}
            </span>
          </div>
        </div>
      ) : (
        <div className="animate-pulse bg-gray-200 w-full h-full"></div>
      )}
    </div>
  );
}
