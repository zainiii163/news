"use client";

import { memo } from "react";
import { HeroArticleImage } from "@/components/ui/standardized-images";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import Link from "next/link";
import { TYPOGRAPHY } from "@/lib/constants/typography";

interface HeroNewsProps {
  title: string;
  image: string;
  category?: string;
  description?: string;
  url: string;
  timestamp?: string | Date;
  isBreaking?: boolean;
}

export const HeroNewsArticle = memo(function HeroNewsArticle({
  title,
  image,
  category,
  description,
  url,
  timestamp,
  isBreaking = false,
}: HeroNewsProps) {
  if (!title || !url) return null;

  return (
    <Link
      href={url}
      className="group block w-full"
      style={{ textDecoration: 'none' }}
    >
      <div className="relative w-full overflow-hidden">
        {/* Large Full-Width Image - 16:9 Standardized Aspect Ratio */}
        {image && image.trim() !== "" ? (
          <HeroArticleImage
            src={image}
            alt={title}
            className="group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-lg text-gray-500">Image not available</p>
          </div>
        )}
        
        {/* Absolute Overlay with Gradient Background for Readability */}
        <div 
          className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12"
          style={{
            position: 'absolute',
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 60%, transparent 100%)',
          }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Category Label */}
            <div className="mb-3 flex items-center gap-3">
              {isBreaking && (
                <span className={TYPOGRAPHY.BREAKING_BADGE.fontSize.className}>
                  Breaking
                </span>
              )}
              {category && (
                <span className={TYPOGRAPHY.CATEGORY_LABEL.fontSize.className}>
                  {category}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className={`${TYPOGRAPHY.HERO_HEADLINE.fontSize.className} mb-3 group-hover:text-red-400 transition-colors`}>
              {title}
            </h1>

            {/* Short Description */}
            {description && (
              <p className={`${TYPOGRAPHY.ARTICLE_SUMMARY.fontSize.className} mb-3 max-w-3xl`}>
                {description}
              </p>
            )}

            {/* Timestamp */}
            {timestamp && (
              <div className={TYPOGRAPHY.TIMESTAMP.fontSize.className}>
                {formatRelativeTime(timestamp)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});

HeroNewsArticle.displayName = 'HeroNewsArticle';
