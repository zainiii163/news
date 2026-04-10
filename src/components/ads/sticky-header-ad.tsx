"use client";

import { usePathname } from "next/navigation";
import { useAdBySlot } from "@/lib/hooks/useAds";
import { Ad } from "@/types/ads.types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import { adsApi } from "@/lib/api/modules/ads.api";
import { getImageUrl } from "@/lib/helpers/imageUrl";

const CNN_AD_FONT = 'CNN, "Helvetica Neue", Helvetica, Arial, sans-serif';

/** edition.cnn.com ATF: desktop leaderboard 970×90 (matches DOM `data-ad-slot-rendered-size`); mobile 320×50 */
const AD_LEADERBOARD = {
  desktop: { width: 970, height: 90 },
  mobile: { width: 320, height: 50 },
} as const;

function CnnAdDisplay({
  ad,
  slotId = "ad_bnr_atf_01",
  renderedSizeDesktop,
  renderedSizeMobile,
}: {
  ad: Ad;
  slotId?: string;
  renderedSizeDesktop: string;
  renderedSizeMobile: string;
}) {
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

  const imageEl = (
    <Image
      src={imageUrl}
      alt={ad.title}
      fill
      style={{ objectFit: "contain", objectPosition: "center" }}
      quality={85}
      loading="eager"
      priority
      unoptimized={shouldUnoptimize}
      sizes="(max-width: 767px) 320px, 970px"
      onError={() => {
        if (!imageOptimizationFailed) setImageOptimizationFailed(true);
      }}
    />
  );

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
      data-ad-slot-rendered-size-desktop={renderedSizeDesktop}
      data-ad-slot-rendered-size-mobile={renderedSizeMobile}
    >
      <div id={slotId} className="ad adfuel-rendered">
        {ad.targetLink && ad.targetLink.trim() ? (
          <Link
            href={ad.targetLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="cnn-atf-creative-frame"
          >
            <div className="cnn-atf-creative-fill">{imageEl}</div>
          </Link>
        ) : (
          <div className="cnn-atf-creative-frame">
            <div className="cnn-atf-creative-fill">{imageEl}</div>
          </div>
        )}
      </div>

      <div className="ad-slot__feedback ad-feedback-link-container cnn-atf-ad-feedback">
        <div
          className="ad-slot__ad-label"
          data-ad-label-text="Advertisement"
          style={{
            fontFamily: CNN_AD_FONT,
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.65)",
          }}
        >
          Advertisement
        </div>

        <button
          type="button"
          onClick={handleAdFeedback}
          className="ad-feedback-link"
          data-ad-type="DISPLAY"
          data-ad-identifier={slotId}
          style={{
            fontFamily: CNN_AD_FONT,
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.65)",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
            background: "transparent",
            border: "none",
            padding: 0,
            transition: "color 0.15s ease, opacity 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.95)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)";
          }}
        >
          <span className="ad-feedback-link__label">Ad Feedback</span>
        </button>
      </div>

      <iframe
        className="resizeListenerIframe"
        src="about:blank"
        tabIndex={-1}
        frameBorder={0}
        aria-hidden="true"
        title=""
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

function PlaceholderSlot({
  label,
  renderedSizeDesktop,
  renderedSizeMobile,
}: {
  label: string;
  renderedSizeDesktop: string;
  renderedSizeMobile: string;
}) {
  return (
    <div
      data-uri="cms.cnn.com/_components/ad-slot/instances/cnn-v1@published"
      className="ad-slot adSlotLoaded"
      data-path="header/ad-slot-header[0]/items"
      data-desktop-slot-id="ad_bnr_atf_01"
      data-mobile-slot-id="ad_bnr_atf_01"
      data-ad-label-text="Advertisement"
      data-unselectable="true"
      data-ad-slot-rendered-size-desktop={renderedSizeDesktop}
      data-ad-slot-rendered-size-mobile={renderedSizeMobile}
    >
      <div id="ad_bnr_atf_01" className="ad" style={{ display: "none" }} aria-hidden />
      <div className="cnn-atf-creative-frame">
        <div
          className="cnn-atf-creative-fill flex items-center justify-center box-border"
          style={{
            backgroundColor: "#444444",
            border: "1px solid #555555",
          }}
        >
          <span
            style={{
              fontFamily: CNN_AD_FONT,
              fontSize: "11px",
              fontWeight: 500,
              color: "#666666",
              letterSpacing: "0.04em",
              padding: "0 8px",
              textAlign: "center",
            }}
          >
            {label}
          </span>
        </div>
      </div>
      <div className="ad-slot__feedback ad-feedback-link-container cnn-atf-ad-feedback">
        <div
          className="ad-slot__ad-label"
          data-ad-label-text="Advertisement"
          style={{
            fontFamily: CNN_AD_FONT,
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.65)",
          }}
        >
          Advertisement
        </div>
      </div>
    </div>
  );
}

export function StickyHeaderAd() {
  const pathname = usePathname();
  const { data, isLoading, error } = useAdBySlot("TOP_BANNER", 5);

  const renderedSizeDesktop = `${AD_LEADERBOARD.desktop.width}x${AD_LEADERBOARD.desktop.height}`;
  const renderedSizeMobile = `${AD_LEADERBOARD.mobile.width}x${AD_LEADERBOARD.mobile.height}`;

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

  if (isLoading) {
    return (
      <PlaceholderSlot
        label="Loading advertisement…"
        renderedSizeDesktop={renderedSizeDesktop}
        renderedSizeMobile={renderedSizeMobile}
      />
    );
  }

  if (error || !hasAds || !ad) {
    return (
      <PlaceholderSlot
        label="Advertisement"
        renderedSizeDesktop={renderedSizeDesktop}
        renderedSizeMobile={renderedSizeMobile}
      />
    );
  }

  return (
    <CnnAdDisplay
      ad={ad}
      slotId="ad_bnr_atf_01"
      renderedSizeDesktop={renderedSizeDesktop}
      renderedSizeMobile={renderedSizeMobile}
    />
  );
}
