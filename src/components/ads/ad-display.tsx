"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import Link from "next/link";
import { Ad } from "@/types/ads.types";
import { adsApi } from "@/lib/api/modules/ads.api";
import { getSlotDimensions } from "@/lib/helpers/ad-rotation";
import { getImageUrl } from "@/lib/helpers/imageUrl";

interface AdDisplayProps {
  ad: Ad;
  className?: string;
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
}

export function AdDisplay({ ad, className = "", slot }: AdDisplayProps) {
  // TOP_BANNER ads are above the fold and might be LCP, so use eager loading
  const isAboveFold = slot === "TOP_BANNER" || slot === "HEADER";
  const adRef = useRef<HTMLDivElement>(null);
  const impressionTracked = useRef(false);
  const [isMounted] = useState(() => typeof window !== "undefined");
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Handle mobile detection on client side only to avoid hydration mismatch
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track impression when ad comes into view
  useEffect(() => {
    if (impressionTracked.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !impressionTracked.current) {
            impressionTracked.current = true;
            // Track impression
            adsApi.trackImpression(ad.id).catch((err) => {
              console.error("Failed to track ad impression:", err);
            });
          }
        });
      },
      { threshold: 0.5 } // Track when 50% visible
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
    // Track click
    adsApi.trackClick(ad.id).catch((err) => {
      console.error("Failed to track ad click:", err);
    });
  };

  // Determine ad dimensions based on slot type or ad type - CNN style dimensions
  const getAdDimensions = () => {
    if (slot) {
      return getSlotDimensions(slot);
    }

    // CNN-style ad dimensions
    switch (ad.type) {
      case "BANNER_TOP":
        return { width: 970, height: 90 }; // CNN leaderboard
      case "BANNER_SIDE":
        return { width: 300, height: 250 }; // CNN medium rectangle
      case "INLINE":
        return { width: 728, height: 90 }; // CNN banner
      case "FOOTER":
        return { width: 970, height: 250 }; // CNN large footer
      default:
        return { width: 300, height: 250 }; // CNN standard
    }
  };

  const dimensions = getAdDimensions();

  // Get normalized image URL
  const imageUrl = useMemo(() => {
    return getImageUrl(ad.imageUrl);
  }, [ad.imageUrl]);

  // OptimizedImage component handles unoptimized logic automatically
  // No need for manual unoptimized checks here

  // Responsive classes - CNN style layout
  const isSidebar = slot === "SIDEBAR" || slot === "MOBILE";

  const responsiveClasses = !isMounted
    ? "w-full"
    : isMobile
    ? "w-full max-w-full min-w-[300px] mx-auto"
    : isSidebar
    ? "w-full min-w-[300px] max-w-[300px]"
    : slot === "INLINE" ||
      slot === "MID_PAGE" ||
      slot === "BETWEEN_SECTIONS" ||
      slot === "BETWEEN_SECTIONS_1" ||
      slot === "BETWEEN_SECTIONS_2" ||
      slot === "BETWEEN_SECTIONS_3"
    ? "w-full max-w-[728px] min-w-[300px] mx-auto"
    : slot === "TOP_BANNER" || slot === "HEADER"
    ? "w-full max-w-[970px] min-w-[728px] mx-auto"
    : slot === "FOOTER"
    ? "w-full max-w-[970px] min-w-[728px] mx-auto"
    : "w-full max-w-full mx-auto";

  // Merge className properly - ensure centering for non-sidebar ads
  const mergedClassName = isSidebar
    ? `ad-slot ${className} ${responsiveClasses}`.trim()
    : `ad-slot ${responsiveClasses} ${className}`.trim();

  // Check if the URL is a video
  const isVideo = useMemo(() => {
    if (!imageUrl || typeof imageUrl !== "string") return false;
    return /\.(mp4|webm|ogg|mov)$/i.test(imageUrl);
  }, [imageUrl]);

  // For INLINE, MID_PAGE and BETWEEN_SECTIONS*, use flexible sizing so format stays same (homepage + article)
  // TOP_BANNER and HEADER keep fixed dimensions
  const isFlexibleSlot =
    slot === "INLINE" ||
    slot === "MID_PAGE" ||
    slot === "BETWEEN_SECTIONS" ||
    slot === "BETWEEN_SECTIONS_1" ||
    slot === "BETWEEN_SECTIONS_2" ||
    slot === "BETWEEN_SECTIONS_3";

  // On mobile, TOP_BANNER/HEADER use aspect ratio so full banner is visible (no cropping); image uses object-contain
  const isTopBannerOnMobile = isMounted && isMobile && (slot === "TOP_BANNER" || slot === "HEADER");
  // Footer ads: show full image (object-contain), dark background so no white bars; taller aspect so image shows complete
  const isFooter = slot === "FOOTER";
  const footerAspectRatio = 728 / 200; // taller slot so full image fits without cropping

  const adContent = (
    <div
      className={`relative overflow-hidden rounded w-full border border-gray-300 ${
        isFooter ? "bg-gray-50 flex items-center justify-center" : "bg-white flex items-center justify-center"
      } ${isFlexibleSlot ? "" : ""} ${
        isTopBannerOnMobile ? "" : ""
      } ${isFooter ? "min-h-[250px] sm:min-h-[250px]" : "min-h-[90px]"}`}
      style={
        isFlexibleSlot
          ? {}
          : isFooter
          ? { aspectRatio: `${970 / 250}`, minHeight: "250px" }
          : slot === "TOP_BANNER" || slot === "HEADER"
          ? { aspectRatio: `${970 / 90}`, minHeight: "90px" }
          : { aspectRatio: `${dimensions.width} / ${dimensions.height}` }
      }
    >
      {imageUrl && imageUrl.trim() !== "" ? (
        isVideo ? (
          <video
            src={imageUrl}
            controls={!ad.targetLink?.trim()}
            className={`${isFlexibleSlot ? "w-full h-auto max-h-[600px] object-contain" : "w-full h-full object-cover"} ${ad.targetLink?.trim() ? "pointer-events-none" : ""}`}
            playsInline
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        ) : isFlexibleSlot ? (
          // For flexible slots, use OptimizedImage with natural sizing
          <div className="relative w-full" style={{ maxHeight: "600px" }}>
            <OptimizedImage
              src={typeof imageUrl === "string" ? imageUrl : ""}
              alt={ad.title}
              width={1200}
              height={600}
              className="w-full h-auto object-contain"
              style={{ transition: "none", display: "block" }}
              quality={85}
            />
          </div>
        ) : isFooter ? (
          // Footer: full image visible (object-contain), no cropping; container has min-height only so image can scale to fit
          <OptimizedImage
            src={imageUrl}
            alt={ad.title}
            fill
            className="object-contain w-full h-full"
            quality={85}
            loading={isAboveFold ? "eager" : "lazy"}
            priority={isAboveFold}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 364px"
            style={{ transition: "none", objectFit: "contain" }}
            onError={(e) => {
              // OptimizedImage handles errors internally, but we can hide on error
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        ) : (
          <OptimizedImage
            src={imageUrl}
            alt={ad.title}
            fill
            className={
              isTopBannerOnMobile ? "object-contain w-full h-full" : "object-cover w-full h-full"
            }
            quality={85}
            loading={isAboveFold ? "eager" : "lazy"}
            priority={isAboveFold}
            sizes="(max-width: 768px) 100vw, 728px"
            style={{
              transition: "none",
              objectFit: isTopBannerOnMobile ? "contain" : "cover",
            }}
            onError={(e) => {
              // If optimization failed, try unoptimized version
              if (!imageOptimizationFailed && !shouldUnoptimize) {
                setImageOptimizationFailed(true);
                return;
              }
              // Handle broken images
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        )
      ) : (
        <div className="w-full h-24 bg-gray-50 flex items-center justify-center border border-gray-300">
          <p className="text-xs text-gray-500 font-medium">Advertisement</p>
        </div>
      )}
    </div>
  );

  return (
    <div ref={adRef} className={mergedClassName}>
      {ad.targetLink && ad.targetLink.trim() ? (
        <Link
          href={ad.targetLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="block hover:opacity-90 transition-opacity w-full"
        >
          {adContent}
        </Link>
      ) : (
        <div className="w-full">
          {adContent}
        </div>
      )}
      <div className="text-xs text-gray-400 mt-2 text-center font-medium uppercase tracking-wide">Advertisement</div>
    </div>
  );
}
