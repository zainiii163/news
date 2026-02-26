"use client";

import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { formatDate, formatRelativeTime } from "@/lib/helpers/formatDate";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import Link from "next/link";

// Helper function to check if breaking news is still fresh (within 1 hour)
function isBreakingNewsFresh(createdAt: string | Date): boolean {
  const now = new Date();
  const created = new Date(createdAt);
  const hoursSinceCreation = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return hoursSinceCreation <= 1; // Hide after 1 hour
}

// Editorial Card - Clean layout with border-bottom separators
function EditorialCard({ news }: { news: News }) {
  const shouldShowBreaking = news.isBreaking && isBreakingNewsFresh(news.createdAt);

  return (
    <Link
      href={`/news/${news.slug || news.id}`}
      className="group block py-4 border-b border-gray-300 hover:bg-gray-50 transition-colors"
    >
      {/* Desktop: Image left, content right | Mobile: Stacked */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Image */}
        <div className="relative w-full md:w-48 h-48 md:h-32 shrink-0 overflow-hidden">
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
                quality={85}
                sizes="(max-width: 768px) 100vw, 200px"
              />
            )
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-sm text-gray-500">Image not available</p>
            </div>
          )}
          {shouldShowBreaking && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold z-10">
              BREAKING
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Category and Breaking Badge */}
          <div className="flex items-center gap-2 mb-2">
            {shouldShowBreaking && (
              <span className="inline-block bg-red-600 text-white px-2 py-0.5 text-xs font-bold">
                BREAKING
              </span>
            )}
            {news.category && (
              <span className="text-xs font-black text-red-600 uppercase tracking-wider">
                {news.category.nameEn}
              </span>
            )}
          </div>

          {/* Headline */}
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:underline transition-colors line-clamp-3 leading-tight mb-2">
            {news.title}
          </h3>

          {/* Excerpt */}
          {news.summary && (
            <p className="text-base text-gray-700 line-clamp-2 leading-relaxed mb-2">
              {news.summary}
            </p>
          )}

          {/* Metadata */}
          <div className="text-sm text-gray-500">
            {formatRelativeTime(news.createdAt)}
          </div>
        </div>
      </div>
    </Link>
  );
}

interface FeaturedGridProps {
  news: News[];
  title?: string;
  columns?: 3 | 4;
}

export function FeaturedGrid({
  news,
  title = "Top Stories",
  columns = 3,
}: FeaturedGridProps) {
  if (!news || news.length === 0) return null;

  return (
    <div className="cnn-section">
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wider border-b-2 border-red-600 pb-2">
            {title}
          </h2>
        </div>
      )}
      
      {/* Editorial Layout - Full-width list with border separators */}
      <div className="space-y-0">
        {news.map((story) => (
          <EditorialCard key={story.id} news={story} />
        ))}
      </div>
    </div>
  );
}

