"use client";

import { useMemo } from "react";
import Link from "next/link";
import { News } from "@/types/news.types";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/lib/helpers/cn";
import { OptimizedImage } from "./optimized-image";
import { BookmarkButton } from "@/components/bookmarks/bookmark-button";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { isYouTubeUrl, getYouTubeThumbnail } from "@/lib/helpers/youtube";

// Helper function to check if breaking news is still fresh (within 1 hour)
function isBreakingNewsFresh(createdAt: string | Date): boolean {
  const now = new Date();
  const created = new Date(createdAt);
  const hoursSinceCreation = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return hoursSinceCreation <= 1; // Hide after 1 hour
}

interface NewsCardProps {
  news: News;
  featured?: boolean;
  className?: string;
}

export function NewsCard({ news, featured = false, className }: NewsCardProps) {
  const { language, t } = useLanguage();
  
  // Check if breaking badge should be shown (only if news is breaking AND fresh)
  const shouldShowBreaking = useMemo(() => {
    return news.isBreaking && isBreakingNewsFresh(news.createdAt);
  }, [news.isBreaking, news.createdAt]);
  
  return (
    <Link
      href={`/news/${news.slug || news.id}`}
      prefetch={true}
      className={cn(
        "block group transition",
        featured && "md:col-span-2",
        className
      )}
    >
      <div className="bg-white overflow-hidden h-full border-b border-gray-200 hover:shadow-sm transition-shadow duration-200">
        {(news.mainImage || news.youtubeUrl) && (
          <div className="relative w-full overflow-hidden h-48">
            {/* YouTube thumbnail if YouTube URL is present */}
            {news.youtubeUrl && isYouTubeUrl(news.youtubeUrl) ? (
              <div className="relative w-full h-full">
                <OptimizedImage
                  src={getYouTubeThumbnail(news.youtubeUrl, "high") || ""}
                  alt={news.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  quality={75}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <div className="bg-red-600/90 p-3 opacity-90 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : news.mainImage && news.mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
              <div className="relative w-full h-full">
                <video
                  src={getImageUrl(news.mainImage)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <div className="bg-white/90 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-6 h-6 text-gray-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : news.mainImage ? (
              <OptimizedImage
                src={getImageUrl(news.mainImage)}
                alt={news.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                quality={75}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            ) : null}
            {shouldShowBreaking && (
              <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold z-10">
                {t("news.breaking")}
              </span>
            )}
            <div className="absolute top-2 right-2 z-10">
              <BookmarkButton newsId={news.id} className="bg-white/80 backdrop-blur-sm p-2" />
            </div>
          </div>
        )}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-[#CC0000] transition text-gray-900">
            {news.title}
          </h3>
          {news.category && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="text-red-600 font-bold uppercase tracking-wide">
                {language === "it" ? news.category?.nameIt : news.category?.nameEn}
              </span>
              <span className="text-gray-400">•</span>
              <span>{formatRelativeTime(news.createdAt)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

