"use client";

import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import Link from "next/link";

interface HeroCardProps {
  story: News;
  priority?: boolean;
}

export function HeroCard({ story, priority = false }: HeroCardProps) {
  return (
    <Link
      href={`/news/${story.slug || story.id}`}
      className="group block"
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-4">
        {story.mainImage && story.mainImage.trim() !== "" ? (
          <OptimizedImage
            src={getImageUrl(story.mainImage)}
            alt={story.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            quality={90}
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-lg text-gray-500">Image not available</p>
          </div>
        )}
        
        {/* Category label */}
        {story.category && (
          <div className="absolute top-4 left-4">
            <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wide">
              {story.category.nameEn || story.category.nameIt}
            </span>
          </div>
        )}
        
        {/* Overlay with headline and summary */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-3 leading-tight tracking-tight">
            {story.title}
          </h1>
          {story.summary && (
            <p className="text-white/95 text-lg line-clamp-3 leading-relaxed mb-3">
              {story.summary}
            </p>
          )}
          <p className="text-white/80 text-sm">
            {formatRelativeTime(story.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
