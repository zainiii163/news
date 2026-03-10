"use client";

import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import Link from "next/link";

interface VideoCardProps {
  story: News;
  showDuration?: boolean;
}

export function VideoCard({ story, showDuration = true }: VideoCardProps) {
  return (
    <Link
      href={`/news/${story.slug || story.id}`}
      className="group block"
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-3">
        {story.mainImage && story.mainImage.trim() !== "" ? (
          <>
            <OptimizedImage
              src={getImageUrl(story.mainImage)}
              alt={story.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              quality={75}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            
            {/* Video play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-red-600 ml-1">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            
            {/* Video duration placeholder */}
            {showDuration && (
              <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-xs font-semibold rounded">
                {story.youtubeUrl ? "YOUTUBE" : "VIDEO"}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Video not available</p>
          </div>
        )}
      </div>
      
      <h3 className="text-sm font-black text-gray-900 group-hover:text-red-600 transition line-clamp-2 leading-tight">
        {story.title}
      </h3>
      <p className="text-xs text-gray-500 mt-1">
        {formatRelativeTime(story.createdAt)}
      </p>
    </Link>
  );
}
