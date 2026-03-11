"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAdByType } from "@/lib/hooks/useAds";
import { Ad, AdResponse } from "@/types/ads.types";
import { adsApi } from "@/lib/api/modules/ads.api";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import Image from "next/image";

// Popup max size: desktop 640px so image comes fully; mobile 92vw. object-contain so full image visible, never cut.
const POPUP_MAX_PX = 640;
const POPUP_MAX_VW = 92;
const POPUP_MAX_VH = 85;

// Custom popup ad content: container fits image aspect, full image visible (object-contain), no cropping
function PopupAdContent({ ad }: { ad: Ad }) {
  const adRef = useRef<HTMLDivElement>(null);
  const impressionTracked = useRef(false);
  const imageUrl = useMemo(() => getImageUrl(ad.imageUrl), [ad.imageUrl]);
  const isVideo = useMemo(() => {
    if (!imageUrl || typeof imageUrl !== "string") return false;
    return /\.(mp4|webm|ogg|mov)$/i.test(imageUrl);
  }, [imageUrl]);

  // Track impression when ad is visible
  useEffect(() => {
    if (impressionTracked.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !impressionTracked.current) {
            impressionTracked.current = true;
            adsApi.trackImpression(ad.id).catch((err) => {
              console.error("Failed to track ad impression:", err);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    const currentRef = adRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ad.id]);

  const handleClick = () => {
    adsApi.trackClick(ad.id).catch((err) => {
      console.error("Failed to track ad click:", err);
    });
  };

  const adContent = (
    <div
      ref={adRef}
      className="relative overflow-hidden rounded-none bg-gray-100 shrink-0 flex items-center justify-center"
      style={{
        width: `min(${POPUP_MAX_PX}px, ${POPUP_MAX_VW}vw, ${POPUP_MAX_VH}vh)`,
        height: `min(${POPUP_MAX_PX}px, ${POPUP_MAX_VW}vw, ${POPUP_MAX_VH}vh)`,
      }}
    >
      {imageUrl && imageUrl.trim() !== "" ? (
        isVideo ? (
          <video
            src={imageUrl}
            controls={!ad.targetLink?.trim()}
            className="w-full h-full object-contain"
            playsInline
            preload="metadata"
            style={
              ad.targetLink?.trim()
                ? { pointerEvents: "none", objectFit: "contain" }
                : { objectFit: "contain" }
            }
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={typeof imageUrl === "string" ? imageUrl : ""}
            alt={ad.title}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 92vw, 640px"
            quality={85}
            unoptimized={
              typeof imageUrl === "string" && (
                imageUrl.includes("localhost") ||
                imageUrl.includes("127.0.0.1") ||
                imageUrl.includes("api.tgcalabriareport.com")
              )
            }
          />
        )
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <p className="text-xs text-gray-500">No media</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center">
      {ad.targetLink && ad.targetLink.trim() ? (
        <a
          href={ad.targetLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="block hover:opacity-90 transition-opacity"
        >
          {adContent}
        </a>
      ) : (
        <div>{adContent}</div>
      )}
      <p className="text-xs text-gray-500 mt-2 text-center">Advertisement</p>
    </div>
  );
}

export function PopupAd() {
  const pathname = usePathname();
  const { data, isLoading, error } = useAdByType("POPUP", 1) as { data: AdResponse | undefined; isLoading: boolean; error: any };
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // Don't show ads in admin panel, advertiser panel, or editor pages
  // Advertisers CAN see ads on public pages (to see competitors), but NOT in their panel
  const isAdminRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/advertiser") ||
    pathname?.startsWith("/editor") ||
    pathname?.startsWith("/admin-login");

  // Derive selected ad from data instead of using effect
  const selectedAd = useMemo(() => {
    if (data?.data?.ads && data.data.ads.length > 0) {
      return data.data.ads.find((ad: Ad) => ad.type === "POPUP") || null;
    }
    return null;
  }, [data]);

  // Prevent body scroll when popup is visible
  useEffect(() => {
    if (isVisible) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isVisible]);

  // Check if popup has been shown today or in this session
  useEffect(() => {
    if (!selectedAd || hasShown) return;

    const checkIfShown = () => {
      if (typeof window === "undefined") return false;

      // Check session storage (once per session)
      const sessionKey = `popup_ad_shown_${selectedAd.id}`;
      if (sessionStorage.getItem(sessionKey)) {
        return true;
      }

      // Check localStorage (once per day)
      const today = new Date().toDateString();
      const lastShownKey = `popup_ad_last_shown_${selectedAd.id}`;
      const lastShown = localStorage.getItem(lastShownKey);

      if (lastShown === today) {
        return true;
      }

      return false;
    };

    const wasShown = checkIfShown();
    if (wasShown) {
      // Use setTimeout to avoid synchronous setState
      setTimeout(() => {
        setHasShown(true);
      }, 0);
      return;
    }

    // Show popup after 3 seconds delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      setHasShown(true);

      // Mark as shown in session storage
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`popup_ad_shown_${selectedAd.id}`, "true");
        localStorage.setItem(
          `popup_ad_last_shown_${selectedAd.id}`,
          new Date().toDateString()
        );
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [selectedAd, hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  // Don't show in admin routes only (advertisers can see ads on public pages)
  if (isAdminRoute || isLoading || error || !selectedAd || !isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4"
      style={{ 
        zIndex: 10000,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%'
      }}
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div 
        className="relative bg-white rounded-none shadow-2xl w-[96vw] sm:w-[90vw] max-w-2xl max-h-[95vh] overflow-y-auto flex flex-col items-center"
        style={{ zIndex: 10001 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gray-800 text-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-900 transition-colors z-10"
          aria-label="Close ad"
          style={{ zIndex: 10002 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-3 sm:p-4 w-full flex justify-center">
          <PopupAdContent ad={selectedAd} />
        </div>
      </div>
    </div>
  );
}
