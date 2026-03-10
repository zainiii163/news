"use client";

import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import Link from "next/link";

interface HeroNewsProps {
  heroStory: News | null;
}

export function HeroNews({ heroStory }: HeroNewsProps) {
  if (!heroStory) return null;

  return (
    <Link
      href={`/news/${heroStory.slug || heroStory.id}`}
      className="group block"
    >
      <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg">
        {heroStory.mainImage && heroStory.mainImage.trim() !== "" ? (
          <OptimizedImage
            src={getImageUrl(heroStory.mainImage)}
            alt={heroStory.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority
            loading="eager"
            quality={90}
            sizes="50vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-lg text-gray-500">Image not available</p>
          </div>
        )}
        
        {/* CNN-STYLE OVERLAY HEADLINE - BOTTOM LEFT */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4 lg:p-6">
          {heroStory.isBreaking && (
            <div className="mb-2">
              <span className="inline-block bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase tracking-wider">
                Breaking
              </span>
            </div>
          )}
          <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-black text-white mb-2 leading-tight tracking-tight">
            {heroStory.title}
          </h1>
          {heroStory.summary && (
            <p className="text-white/95 text-xs sm:text-sm lg:text-base line-clamp-2 leading-relaxed mb-2">
              {heroStory.summary}
            </p>
          )}
          <div className="text-white/80 text-xs sm:text-sm lg:text-sm">
            {formatRelativeTime(heroStory.createdAt)}
          </div>
        </div>
      </div>
    </Link>
  );
}
