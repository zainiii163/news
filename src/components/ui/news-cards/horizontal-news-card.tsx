"use client";

import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import Link from "next/link";

interface HorizontalNewsCardProps {
  story: News;
  imageSize?: "small" | "medium" | "large";
  showCategory?: boolean;
}

export function HorizontalNewsCard({ 
  story, 
  imageSize = "small",
  showCategory = false
}: HorizontalNewsCardProps) {
  const imageSizes = {
    small: "w-16 h-16",
    medium: "w-20 h-16", 
    large: "w-24 h-18"
  };

  const titleSizes = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base"
  };

  return (
    <Link
      href={`/news/${story.slug || story.id}`}
      className="group block"
    >
      <div className="flex gap-3">
        {story.mainImage && story.mainImage.trim() !== "" && (
          <div className={`relative flex-shrink-0 ${imageSizes[imageSize]} overflow-hidden rounded`}>
            <OptimizedImage
              src={getImageUrl(story.mainImage)}
              alt={story.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              quality={75}
              sizes="80px"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {showCategory && story.category && (
            <span className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1 block">
              {story.category.nameEn || story.category.nameIt}
            </span>
          )}
          
          <h3 className={`${titleSizes[imageSize]} font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-3 leading-tight`}>
            {story.title}
          </h3>
          
          <p className="text-xs text-gray-500 mt-1">
            {formatRelativeTime(story.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
