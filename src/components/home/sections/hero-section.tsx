"use client";

import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { formatDate, formatRelativeTime } from "@/lib/helpers/formatDate";
import Link from "next/link";

interface HeroSectionProps {
  heroStory: News | null;
  leftColumnStories: News[];
  rightColumnStories: News[];
}

export function HeroSection({
  heroStory,
  leftColumnStories,
  rightColumnStories,
}: HeroSectionProps) {
  return (
    <div className="mb-8">
      {/* CNN-STYLE FULL-WIDTH DOMINANT HEADLINE */}
      {heroStory && (
        <Link
          href={`/news/${heroStory.slug || heroStory.id}`}
          className="group block block w-full"
        >
          <div className="relative w-full h-[450px] lg:h-[500px] overflow-hidden">
            {heroStory.mainImage && heroStory.mainImage.trim() !== "" ? (
              <OptimizedImage
                src={getImageUrl(heroStory.mainImage)}
                alt={heroStory.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
                loading="eager"
                quality={90}
                sizes="100vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-lg text-gray-500">Image not available</p>
              </div>
            )}
            
            {/* CNN-STYLE OVERLAY HEADLINE - BOTTOM LEFT */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 lg:p-8">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl lg:text-5xl xl:text-6xl font-black text-white mb-3 leading-tight tracking-tight">
                  {heroStory.title}
                </h1>
                {heroStory.summary && (
                  <p className="text-white/95 text-base lg:text-lg line-clamp-3 leading-relaxed max-w-4xl">
                    {heroStory.summary}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* SECONDARY STORIES - FULL-WIDTH ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* Left column stories */}
        {leftColumnStories.slice(0, 2).map((story) => (
          <Link
            key={story.id}
            href={`/news/${story.slug || story.id}`}
            className="group block border-l-4 border-transparent hover:border-red-600 pl-4 transition-colors"
          >
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-3 leading-tight mb-2">
              {story.title}
            </h3>
            <p className="text-sm text-gray-500">
              {formatRelativeTime(story.createdAt)}
            </p>
          </Link>
        ))}
        
        {/* Right column stories */}
        {rightColumnStories.slice(0, 2).map((story) => (
          <Link
            key={story.id}
            href={`/news/${story.slug || story.id}`}
            className="group block border-l-4 border-transparent hover:border-red-600 pl-4 transition-colors"
          >
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-3 leading-tight mb-2">
              {story.title}
            </h3>
            <p className="text-sm text-gray-500">
              {formatRelativeTime(story.createdAt)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

