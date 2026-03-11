"use client";

import { memo } from "react";
import { NewsCardImage, HorizontalCardImage } from "@/components/ui/standardized-images";
import { formatDate, formatRelativeTime } from "@/lib/helpers/formatDate";
import Link from "next/link";
import { TYPOGRAPHY } from "@/lib/constants/typography";

interface NewsCardProps {
  title: string;
  image: string;
  category?: string;
  date?: string | Date;
  variant: "vertical" | "horizontal";
  url?: string;
  isBreaking?: boolean;
}

export const NewsCard = memo(function NewsCard({
  title,
  image,
  category,
  date,
  variant,
  url,
  isBreaking = false,
}: NewsCardProps) {
  if (!title) return null;

  const cardUrl = url || "#";

  // Vertical Card Layout
  if (variant === "vertical") {
    return (
      <Link
        href={cardUrl}
        className="group block w-full"
        style={{ textDecoration: 'none' }}
      >
        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
          {/* Image Container */}
          <div className="relative w-full overflow-hidden">
            {image && image.trim() !== "" ? (
              <NewsCardImage
                src={image}
                alt={title}
                className="group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-sm text-gray-500">Image not available</p>
              </div>
            )}
            
            {/* Breaking News Badge */}
            {isBreaking && (
              <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 z-10">
                <span className={TYPOGRAPHY.BREAKING_BADGE.fontSize.className}>BREAKING</span>
              </div>
            )}
            
            {/* Category Badge */}
            {category && (
              <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 z-10">
                <span className={TYPOGRAPHY.CATEGORY_LABEL.fontSize.className + ' text-white'}>
                  {category}
                </span>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-4">
            <h3 className={`${TYPOGRAPHY.ARTICLE_TITLE.fontSize.className} text-gray-900 group-hover:text-red-600 transition-colors line-clamp-3 mb-2`}>
              {title}
            </h3>
            
            {date && (
              <div className={TYPOGRAPHY.TIMESTAMP.fontSize.className}>
                {formatRelativeTime(date)}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Horizontal Card Layout
  return (
    <Link
      href={cardUrl}
      className="group block w-full"
      style={{ textDecoration: 'none' }}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div className="flex gap-4 p-4">
          {/* Image Container */}
          <div className="relative flex-shrink-0 overflow-hidden">
            {image && image.trim() !== "" ? (
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                <HorizontalCardImage
                  src={image}
                  alt={title}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div 
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gray-200 flex items-center justify-center"
              >
                <p className="text-xs text-gray-500">No image</p>
              </div>
            )}
            
            {/* Breaking News Badge */}
            {isBreaking && (
              <div className="absolute top-2 left-2 bg-red-600 text-white px-1 py-0.5 z-10">
                <span className={TYPOGRAPHY.BREAKING_BADGE.fontSize.className}>BREAKING</span>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Category */}
            {category && (
              <div className="mb-1">
                <span className={TYPOGRAPHY.CATEGORY_LABEL.fontSize.className}>
                  {category}
                </span>
              </div>
            )}
            
            {/* Title */}
            <h3 className={`${TYPOGRAPHY.SIDEBAR_TITLE.fontSize.className} text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2`}>
              {title}
            </h3>
            
            {/* Date */}
            {date && (
              <div className={TYPOGRAPHY.TIMESTAMP.fontSize.className}>
                {formatRelativeTime(date)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});

NewsCard.displayName = 'NewsCard';
