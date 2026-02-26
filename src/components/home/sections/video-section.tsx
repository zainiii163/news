"use client";

import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { formatDate } from "@/lib/helpers/formatDate";
import Link from "next/link";
import { isYouTubeUrl, getYouTubeThumbnail } from "@/lib/helpers/youtube";

interface VideoSectionProps {
  videos: News[];
  title?: string;
}

function VideoCard({ video, isLarge = false }: { video: News; isLarge?: boolean }) {
  const hasVideo = (video.youtubeUrl && isYouTubeUrl(video.youtubeUrl)) || 
                   (video.mainImage && video.mainImage.match(/\.(mp4|webm|ogg|mov)$/i));

  if (!hasVideo) return null;

  return (
    <Link
      href={`/news/${video.slug || video.id}`}
      className="group block"
    >
      <div className={`relative ${isLarge ? 'aspect-video' : 'aspect-video'} bg-gray-900 overflow-hidden`}>
        {video.youtubeUrl && isYouTubeUrl(video.youtubeUrl) ? (
          <OptimizedImage
            src={getYouTubeThumbnail(video.youtubeUrl, "high") || ""}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            quality={85}
            loading="lazy"
          />
        ) : video.mainImage && video.mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
          <div className="relative w-full h-full">
            <video
              src={getImageUrl(video.mainImage)}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          </div>
        ) : video.mainImage ? (
          <OptimizedImage
            src={getImageUrl(video.mainImage)}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            quality={85}
            loading="lazy"
          />
        ) : null}
        
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300" />
        
        {/* Play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-60 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Video Info */}
      <div className="mt-3">
        <h3 
          className="text-base font-bold leading-tight text-gray-900 mb-2 transition-colors duration-200 hover:text-red-600 line-clamp-2"
          style={{ color: '#0A0A0A' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#CC0000'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#0A0A0A'}
        >
          {video.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{formatDate(video.publishedAt || video.createdAt, "MMM dd")}</span>
          {video.category && (
            <>
              <span>•</span>
              <span>{video.category.nameEn}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export function VideoSection({ videos, title = "Videos" }: VideoSectionProps) {
  if (!videos || videos.length === 0) return null;

  const featuredVideo = videos[0];
  const otherVideos = videos.slice(1, 5); // Take next 4 videos

  return (
    <div className="product-zone" data-component-name="VideoSection">
      <div className="container_ribbon">
        <div className="cnn-container py-6">
          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-wide border-b-2 border-red-600 pb-2">
            {title}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Large Featured Video */}
            <div className="lg:col-span-8">
              <VideoCard video={featuredVideo} isLarge={true} />
            </div>

            {/* 4 Smaller Videos */}
            <div className="lg:col-span-4">
              <div className="space-y-4">
                {otherVideos.map((video) => (
                  <VideoCard key={video.id} video={video} isLarge={false} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
