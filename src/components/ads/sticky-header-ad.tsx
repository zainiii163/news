"use client";

import { usePathname } from "next/navigation";
import { useAdBySlot } from "@/lib/hooks/useAds";
import { Ad } from "@/types/ads.types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import { adsApi } from "@/lib/api/modules/ads.api";
import { getImageUrl } from "@/lib/helpers/imageUrl";

function CnnAdDisplay({ ad, slotId = "ad_bnr_atf_01" }: { ad: Ad; slotId?: string }) {
  const adRef = useRef<HTMLDivElement>(null);
  const impressionTracked = useRef(false);
  const [imageOptimizationFailed, setImageOptimizationFailed] = useState(false);

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
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [ad.id]);

  const handleClick = () => {
    adsApi.trackClick(ad.id).catch((err) => {
      console.error("Failed to track ad click:", err);
    });
  };

  const handleAdFeedback = () => {
    window.open(`/ad-feedback?adId=${ad.id}&slot=${slotId}`, "_blank", "noopener,noreferrer");
  };

  const imageUrl = useMemo(() => getImageUrl(ad.imageUrl), [ad.imageUrl]);

  const isApiDomain = useMemo(() => {
    return typeof imageUrl === "string" && imageUrl.includes("api.tgcalabriareport.com");
  }, [imageUrl]);

  const shouldUnoptimize = imageOptimizationFailed || isApiDomain;

  return (
    <div
      ref={adRef}
      data-uri="cms.cnn.com/_components/ad-slot/instances/cnn-v1@published"
      className="ad-slot adSlotLoaded"
      data-path="header/ad-slot-header[0]/items"
      data-desktop-slot-id={slotId}
      data-mobile-slot-id={slotId}
      data-ad-label-text="Advertisement"
      data-unselectable="true"
      data-ad-slot-rendered-size="970x90"
    >
      {/* Ad Container - CNN style 970x90 */}
      <div id={slotId} className="ad adfuel-rendered">
        {ad.targetLink && ad.targetLink.trim() ? (
          <Link
            href={ad.targetLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            style={{ display: "block" }}
          >
            <div
              style={{
                position: "relative",
                width: "970px",
                height: "90px",
                maxWidth: "100%",
                backgroundColor: "#000000",
                overflow: "hidden",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={imageUrl}
                alt={ad.title}
                fill
                style={{ objectFit: "contain", objectPosition: "center" }}
                quality={85}
                loading="eager"
                priority
                unoptimized={shouldUnoptimize}
                sizes="970px"
                onError={() => {
                  if (!imageOptimizationFailed) setImageOptimizationFailed(true);
                }}
              />
            </div>
          </Link>
        ) : (
          <div
            style={{
              position: "relative",
              width: "970px",
              height: "90px",
              maxWidth: "100%",
              backgroundColor: "#000000",
              overflow: "hidden",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={imageUrl}
              alt={ad.title}
              fill
              style={{ objectFit: "contain", objectPosition: "center" }}
              quality={85}
              loading="eager"
              priority
              unoptimized={shouldUnoptimize}
              sizes="970px"
              onError={() => {
                if (!imageOptimizationFailed) setImageOptimizationFailed(true);
              }}
            />
          </div>
        )}
      </div>

      {/* CNN-style feedback bar - exact match */}
      <div
        className="ad-slot__feedback ad-feedback-link-container"
        style={{ 
          width: "970px", 
          maxWidth: "100%", 
          marginTop: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left: Advertisement label */}
        <div
          className="ad-slot__ad-label"
          data-ad-label-text="Advertisement"
          style={{
            fontSize: "12px",
            color: "#ffffff",
            opacity: 0.7,
          }}
        >
          Advertisement
        </div>

        {/* Right: Ad Feedback */}
        <button
          onClick={handleAdFeedback}
          className="ad-feedback-link"
          data-ad-type="DISPLAY"
          data-ad-identifier={slotId}
          style={{
            fontSize: "12px",
            color: "#ffffff",
            opacity: 0.7,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
            background: "transparent",
            border: "none",
            padding: 0,
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="ad-feedback-link__label">Ad Feedback</span>
        </button>
      </div>

      {/* Resize listener iframe (CNN style) */}
      <iframe
        className="resizeListenerIframe"
        src="about:blank"
        tabIndex={-1}
        frameBorder={0}
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          border: "none",
        }}
      />
    </div>
  );
}

export function StickyHeaderAd() {
  const pathname = usePathname();
  const { data, isLoading, error } = useAdBySlot("TOP_BANNER", 5);

  const isAdminRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/advertiser") ||
    pathname?.startsWith("/editor") ||
    pathname?.startsWith("/admin-login");

  if (isAdminRoute) {
    return null;
  }

  const rawAds = (data as { data?: { ads?: Ad[] } })?.data?.ads ?? [];
  const hasAds = Array.isArray(rawAds) && rawAds.length > 0;
  const ad = hasAds ? rawAds[0] : null;

  // Always show the ad slot container (black background) even when loading or no ads
  // This ensures the ad space is visible like CNN
  return (
    <div
      className="ad-slot-header__wrapper"
      style={{
        width: "100%",
        backgroundColor: "#000000",
        padding: "20px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "150px",
      }}
    >
      <div
        className="ad-slot-header__container adSlotHeaderContainer"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {isLoading ? (
          // Show loading placeholder
          <div
            style={{
              width: "970px",
              height: "90px",
              maxWidth: "100%",
              backgroundColor: "#1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Loading advertisement...
          </div>
        ) : hasAds && ad ? (
          // Show actual ad
          <CnnAdDisplay ad={ad} slotId="ad_bnr_atf_01" />
        ) : (
          // Show placeholder when no ads available
          <div
            style={{
              width: "970px",
              height: "90px",
              maxWidth: "100%",
              backgroundColor: "#1a1a1a",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              fontSize: "14px",
              gap: "8px",
            }}
          >
            <div>Advertisement</div>
            <div style={{ fontSize: "12px", opacity: 0.7 }}>
              Ad space available - 970x90
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
