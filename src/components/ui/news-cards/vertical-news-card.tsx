"use client";

import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import Link from "next/link";

interface VerticalNewsCardProps {
  story: News;
  showCategory?: boolean;
  size?: "small" | "medium" | "large";
}

export function VerticalNewsCard({ 
  story, 
  showCategory = false, 
  size = "medium" 
}: VerticalNewsCardProps) {
  const sizeClasses = {
    small: "text-sm",
    medium: "text-lg",
    large: "text-xl"
  };

  return (
    <Link
      href={`/news/${story.slug || story.id}`}
      className="group block"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-3">
        {story.mainImage && story.mainImage.trim() !== "" ? (
          <OptimizedImage
            src={getImageUrl(story.mainImage)}
            alt={story.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            quality={75}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Image not available</p>
          </div>
        )}
        
        {/* Category label */}
        {showCategory && story.category && (
          <div className="absolute top-2 left-2">
            <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase">
              {story.category.nameEn || story.category.nameIt}
            </span>
          </div>
        )}
      </div>
      
      <h3 className={`${sizeClasses[size]} font-black text-gray-900 group-hover:text-red-600 transition line-clamp-2 leading-tight`}>
        {story.title}
      </h3>
      <p className="text-xs text-gray-500 mt-1">
        {formatRelativeTime(story.createdAt)}
      </p>
    </Link>
  );
}
