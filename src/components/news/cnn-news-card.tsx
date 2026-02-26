"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { formatDate, formatRelativeTime } from "@/lib/helpers/formatDate";
import { cn } from "@/lib/helpers/cn";
import { getImageUrl } from "@/lib/helpers/imageUrl";

// Helper function to check if breaking news is still fresh (within 1 hour)
function isBreakingNewsFresh(createdAt: string | Date): boolean {
  const now = new Date();
  const created = new Date(createdAt);
  const hoursSinceCreation = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return hoursSinceCreation <= 1; // Hide after 1 hour
}

interface BaseCardProps {
  news: News;
  className?: string;
}

// Hero Card - Large featured story (CNN style)
export const HeroCard = memo(function HeroCard({ news, className }: BaseCardProps) {
  const router = useRouter();
  
  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (news.category) {
      router.push(`/category/${news.category.slug}`);
    }
  };

  // Check if breaking badge should be shown (only if news is breaking AND fresh)
  const shouldShowBreaking = useMemo(() => {
    return news.isBreaking && isBreakingNewsFresh(news.createdAt);
  }, [news.isBreaking, news.createdAt]);

  return (
    <Link href={`/news/${news.slug || news.id}`} className={cn("block group", className)}>
      <div className="cursor-pointer">
        {/* CNN-style: Image first, then text below */}
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[450px] overflow-hidden mb-4">
          {news.mainImage && news.mainImage.trim() !== "" ? (
            news.mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
              <div className="relative w-full h-full">
                <video
                  src={getImageUrl(news.mainImage)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  muted
                  playsInline
                  preload="metadata"
                />
                {shouldShowBreaking && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-sm font-black z-10">
                    BREAKING
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full h-full">
                <OptimizedImage
                  src={getImageUrl(news.mainImage)}
                  alt={news.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                  loading="eager"
                  quality={85}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                />
                {shouldShowBreaking && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-sm font-black z-10">
                    BREAKING
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-xs text-gray-500">Image not available</p>
            </div>
          )}
        </div>
        
        {/* CNN-style text below image */}
        <div className="px-1">
          {news.category && (
            <div className="mb-2">
              <span
                onClick={handleCategoryClick}
                className="text-xs font-black text-red-600 uppercase tracking-wider hover:text-red-700 transition cursor-pointer"
              >
                {news.category.nameEn}
              </span>
            </div>
          )}
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2 group-hover:text-red-600 transition line-clamp-3 leading-tight">
            {news.title}
          </h1>
          {news.summary && (
            <p className="text-base text-gray-700 mb-2 line-clamp-2 max-w-3xl leading-relaxed">
              {news.summary}
            </p>
          )}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{formatDate(news.createdAt, "MMM dd, yyyy")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

// Compact Card - Small thumbnail + title (left column style) - CNN style
export const CompactCard = memo(function CompactCard({ news, className }: BaseCardProps) {
  const shouldShowBreaking = useMemo(() => {
    return news.isBreaking && isBreakingNewsFresh(news.createdAt);
  }, [news.isBreaking, news.createdAt]);

  return (
    <Link
      href={`/news/${news.slug || news.id}`}
      className={cn("block group cursor-pointer border-b border-gray-200 pb-2 hover:bg-gray-50 p-2 transition", className)}
    >
      <div className="flex gap-3">
        <div className="relative w-20 h-20 shrink-0 overflow-hidden">
          {news.mainImage && news.mainImage.trim() !== "" ? (
            news.mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
              <div className="relative w-full h-full">
                <video
                  src={getImageUrl(news.mainImage)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="bg-white/80 p-1">
                    <svg
                      className="w-3 h-3 text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <OptimizedImage
                src={getImageUrl(news.mainImage)}
                alt={news.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                quality={75}
                sizes="(max-width: 768px) 100vw, 80px"
              />
            )
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-xs text-gray-500">No img</p>
            </div>
          )}
          {shouldShowBreaking && (
            <div className="absolute top-1 left-1 bg-red-600 text-white px-1 py-0.5 text-xs font-bold">
              BREAKING
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-gray-900 group-hover:text-red-600 transition line-clamp-3 leading-tight">
            {news.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {formatRelativeTime(news.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
});

// Headline Card - Text-only (CNN style for headlines section)
export const HeadlineCard = memo(function HeadlineCard({ news, className }: BaseCardProps) {
  const shouldShowBreaking = useMemo(() => {
    return news.isBreaking && isBreakingNewsFresh(news.createdAt);
  }, [news.isBreaking, news.createdAt]);

  return (
    <Link
      href={`/news/${news.slug || news.id}`}
      className={cn("block group cursor-pointer", className)}
    >
      <div className="py-2">
        {shouldShowBreaking && (
          <span className="inline-block bg-red-600 text-white px-2 py-0.5 text-xs font-bold mb-1">
            BREAKING
          </span>
        )}
        <h3 className="text-base font-black text-gray-900 group-hover:text-red-600 transition line-clamp-2 leading-tight">
          {news.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {formatRelativeTime(news.createdAt)}
        </p>
      </div>
    </Link>
  );
});

// Grid Card - Medium size for grid layouts - CNN style
export const GridCard = memo(function GridCard({ news, className }: BaseCardProps) {
  // Check if breaking badge should be shown (only if news is breaking AND fresh)
  const shouldShowBreaking = useMemo(() => {
    return news.isBreaking && isBreakingNewsFresh(news.createdAt);
  }, [news.isBreaking, news.createdAt]);

  return (
    <Link
      href={`/news/${news.slug || news.id}`}
      className={cn("block group cursor-pointer", className)}
    >
      <div className="relative h-48 mb-2 overflow-hidden">
        {news.mainImage && news.mainImage.trim() !== "" ? (
          news.mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <div className="relative w-full h-full">
              <video
                src={getImageUrl(news.mainImage)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                muted
                playsInline
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="bg-white/80 p-2">
                  <svg
                    className="w-5 h-5 text-gray-900"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <OptimizedImage
              src={getImageUrl(news.mainImage)}
              alt={news.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-xs text-gray-500">Image not available</p>
          </div>
        )}
        {shouldShowBreaking && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold z-10">
            BREAKING
          </div>
        )}
      </div>
      {news.category && (
        <div className="mb-1">
          <span className="text-xs font-extrabold text-red-600 uppercase tracking-wide">
            {news.category.nameEn}
          </span>
        </div>
      )}
      <h3 className="text-base md:text-lg font-black text-gray-900 mb-1 group-hover:text-red-600 transition line-clamp-2 leading-tight">
        {news.title}
      </h3>
      {news.summary && (
        <p className="text-base text-gray-700 line-clamp-2 mb-1">
          {news.summary}
        </p>
      )}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {formatRelativeTime(news.createdAt)}
        </p>
      </div>
    </Link>
  );
});

// Horizontal Card - Image + text side-by-side - CNN style
export const HorizontalCard = memo(function HorizontalCard({ news, className }: BaseCardProps) {
  const shouldShowBreaking = useMemo(() => {
    return news.isBreaking && isBreakingNewsFresh(news.createdAt);
  }, [news.isBreaking, news.createdAt]);

  return (
    <Link
      href={`/news/${news.slug || news.id}`}
      className={cn("block group cursor-pointer border-b border-gray-200 pb-2 hover:bg-gray-50 p-2 transition", className)}
    >
      <div className="flex gap-4">
        <div className="relative w-32 h-32 shrink-0 overflow-hidden">
          {news.mainImage && news.mainImage.trim() !== "" ? (
            news.mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
              <div className="relative w-full h-full">
                <video
                  src={getImageUrl(news.mainImage)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="bg-white/80 p-2">
                    <svg
                      className="w-5 h-5 text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <OptimizedImage
                src={getImageUrl(news.mainImage)}
                alt={news.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                quality={75}
                sizes="(max-width: 768px) 100vw, 200px"
              />
            )
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-xs text-gray-500">Image not available</p>
            </div>
          )}
          {shouldShowBreaking && (
            <div className="absolute top-1 left-1 bg-red-600 text-white px-1 py-0.5 text-xs font-bold z-10">
              BREAKING
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {shouldShowBreaking && (
            <span className="inline-block bg-red-600 text-white px-2 py-0.5 text-xs font-bold mb-1">
              BREAKING
            </span>
          )}
          {news.category && (
            <div className="mb-1">
              <span className="text-xs font-extrabold text-red-600 uppercase tracking-wide">
                {news.category.nameEn}
              </span>
            </div>
          )}
          <h3 className="text-base md:text-lg font-black text-gray-900 group-hover:text-red-600 transition line-clamp-2 leading-tight mb-1">
            {news.title}
          </h3>
          {news.summary && (
            <p className="text-base text-gray-700 line-clamp-2 mb-1">
              {news.summary}
            </p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {formatRelativeTime(news.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
});

// Small Vertical Card - For tight spaces
export const SmallVerticalCard = memo(function SmallVerticalCard({ news, className }: BaseCardProps) {
  return (
    <Link
      href={`/news/${news.slug || news.id}`}
      className={cn("block group cursor-pointer", className)}
    >
      <div className="relative h-32 mb-1 overflow-hidden">
        {news.mainImage && news.mainImage.trim() !== "" ? (
          news.mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <div className="relative w-full h-full">
              <video
                src={getImageUrl(news.mainImage)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                muted
                playsInline
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="bg-white/80 p-1.5">
                  <svg
                    className="w-4 h-4 text-gray-900"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <OptimizedImage
              src={getImageUrl(news.mainImage)}
              alt={news.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-xs text-gray-500">Image not available</p>
          </div>
        )}
      </div>
      {news.category && (
        <div className="mb-1">
          <span className="text-xs font-extrabold text-red-600 uppercase tracking-wide">
            {news.category.nameEn}
          </span>
        </div>
      )}
      <h3 className="text-sm font-black text-gray-900 group-hover:text-red-600 transition line-clamp-2">
        {news.title}
      </h3>
      <p className="text-xs text-gray-500 mt-1">
        {formatRelativeTime(news.createdAt)}
      </p>
    </Link>
  );
});

