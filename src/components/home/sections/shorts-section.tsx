"use client";

import { useState, useRef, useEffect } from "react";
import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { formatDate } from "@/lib/helpers/formatDate";
import Link from "next/link";
import { isYouTubeUrl, getYouTubeThumbnail } from "@/lib/helpers/youtube";

interface ShortsSectionProps {
  shorts: News[];
  title?: string;
}

function ShortCard({ short }: { short: News }) {
  return (
    <Link
      href={`/news/${short.slug || short.id}`}
      className="group block flex-shrink-0"
    >
      <div className="relative w-[280px] h-[200px] bg-gray-900 overflow-hidden rounded-sm">
        {short.youtubeUrl && isYouTubeUrl(short.youtubeUrl) ? (
          <OptimizedImage
            src={getYouTubeThumbnail(short.youtubeUrl, "high") || ""}
            alt={short.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            quality={85}
            loading="lazy"
          />
        ) : short.mainImage && short.mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
          <div className="relative w-full h-full">
            <video
              src={getImageUrl(short.mainImage)}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          </div>
        ) : short.mainImage ? (
          <OptimizedImage
            src={getImageUrl(short.mainImage)}
            alt={short.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            quality={85}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-200"></div>
        )}
        
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300" />
        
        {/* Text Overlay - CNN Style */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3">
          <h3 
            className="text-sm font-[900] text-white mb-1 line-clamp-2 group-hover:text-[#FFD700] transition-colors"
          >
            {short.title}
          </h3>
          <div className="text-xs text-white/80">
            {formatDate(short.publishedAt || short.createdAt, "MMM dd")}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ShortsSection({ shorts, title = "CNN SHORTS" }: ShortsSectionProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter shorts that have images/videos
  const validShorts = shorts.filter((short) => 
    (short.youtubeUrl && isYouTubeUrl(short.youtubeUrl)) || 
    (short.mainImage && short.mainImage.trim() !== "")
  );

  // Update scroll state
  useEffect(() => {
    if (!validShorts || validShorts.length === 0) return;
    const updateScrollState = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        setCanScrollLeft(scrollPosition > 0);
        setCanScrollRight(scrollPosition < maxScroll - 10);
      }
    };

    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition, validShorts.length]);

  if (!validShorts || validShorts.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = 300;
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(
            container.scrollWidth - container.clientWidth,
            scrollPosition + scrollAmount
          );

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
    setScrollPosition(newPosition);
  };

  return (
    <div className="product-zone" data-component-name="ShortsSection">
      <div className="container_ribbon">
        <div className="cnn-container py-6">
          {/* Section Header - CNN Style */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-black"></div>
              <h2 className="text-xs font-[800] uppercase tracking-[0.1em] text-black">
                {title}
              </h2>
            </div>
            {/* Scroll Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="w-8 h-8 flex items-center justify-center bg-white border border-[#E6E6E6] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FAFAFA] transition-colors"
                aria-label="Scroll left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="w-8 h-8 flex items-center justify-center bg-white border border-[#E6E6E6] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FAFAFA] transition-colors"
                aria-label="Scroll right"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Horizontal Scrolling Carousel - CNN Style */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onScroll={(e) => {
              setScrollPosition(e.currentTarget.scrollLeft);
            }}
          >
            {validShorts.slice(0, 20).map((short) => (
              <ShortCard key={short.id} short={short} />
            ))}
          </div>
          
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
