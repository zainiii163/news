"use client";

import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { formatRelativeTime, formatDate } from "@/lib/helpers/formatDate";
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
    <div className="cnn-container py-6">
      {/* CNN-STYLE 3-COLUMN HERO LAYOUT: 3/6/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN - TOP STORIES */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center gap-3">
            <div className="w-1 h-6 bg-black"></div>
            <h3 className="text-xs font-black uppercase tracking-[0.1em] text-black">
              Top Stories
            </h3>
          </div>
          <div className="space-y-3">
            {leftColumnStories.slice(0, 6).map((story) => (
              <Link key={story.id} href={`/news/${story.slug || story.id}`}>
                <div className="group cursor-pointer flex gap-3">
                  <div className="relative w-[80px] h-[60px] flex-shrink-0 overflow-hidden">
                    {story.mainImage && story.mainImage.trim() !== "" ? (
                      <OptimizedImage
                        src={getImageUrl(story.mainImage)}
                        alt={story.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        quality={75}
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-black group-hover:text-red-600 transition-colors line-clamp-2 leading-tight mb-1">
                      {story.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(story.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CENTER COLUMN - HERO ARTICLE */}
        <div className="lg:col-span-6">
          {heroStory && (
            <Link href={`/news/${heroStory.slug || heroStory.id}`}>
              <div className="group cursor-pointer">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-4">
                  {heroStory.mainImage && heroStory.mainImage.trim() !== "" ? (
                    <OptimizedImage
                      src={getImageUrl(heroStory.mainImage)}
                      alt={heroStory.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority={true}
                      loading="eager"
                      quality={90}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                  )}
                  
                  {/* Category Badge - Top Left */}
                  {heroStory.category && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wide">
                        {heroStory.category.nameEn || heroStory.category.nameIt}
                      </span>
                    </div>
                  )}
                  
                  {/* Gradient Overlay from Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent h-1/2"></div>
                  
                  {/* Text Overlay on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h1 className="text-2xl lg:text-3xl xl:text-4xl font-black text-white mb-2 leading-tight tracking-tight line-clamp-3">
                      {heroStory.title}
                    </h1>
                    {heroStory.summary && (
                      <p className="text-white/95 text-sm lg:text-base line-clamp-2 leading-relaxed mb-2">
                        {heroStory.summary}
                      </p>
                    )}
                    <p className="text-white/70 text-xs">
                      {formatDate(heroStory.createdAt, "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* RIGHT COLUMN - TRENDING + LATEST */}
        <div className="lg:col-span-3 space-y-6">
          {/* TRENDING SECTION */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="w-1 h-6 bg-red-600"></div>
              <h3 className="text-xs font-black uppercase tracking-[0.1em] text-black">
                Trending
              </h3>
            </div>
            <div className="space-y-3">
              {rightColumnStories.slice(0, 4).map((story) => (
                <Link key={story.id} href={`/news/${story.slug || story.id}`}>
                  <div className="group cursor-pointer flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1 text-sm">•</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-black group-hover:text-red-600 transition-colors line-clamp-2 leading-tight mb-1">
                        {story.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(story.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* LATEST SECTION */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="w-1 h-6 bg-black"></div>
              <h3 className="text-xs font-black uppercase tracking-[0.1em] text-black">
                Latest
              </h3>
            </div>
            <div className="space-y-3">
              {rightColumnStories.slice(4, 8).map((story) => (
                <Link key={story.id} href={`/news/${story.slug || story.id}`}>
                  <div className="group cursor-pointer">
                    <h3 className="text-sm font-bold text-black group-hover:text-red-600 transition-colors line-clamp-2 leading-tight mb-1">
                      {story.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(story.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

