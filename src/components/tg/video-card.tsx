"use client";

import { TGVideo } from "@/lib/api/modules/tg.api";
import { VideoPlayer } from "@/components/ui/video-player";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/helpers/formatDate";

interface VideoCardProps {
  video: TGVideo;
  className?: string;
  showFullPlayer?: boolean;
}

export function VideoCard({ video, className = "", showFullPlayer = false }: VideoCardProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`bg-white rounded-none shadow-none overflow-hidden ${className}`}>
      {showFullPlayer ? (
        <VideoPlayer
          mediaId={video.id}
          poster={video.thumbnailUrl}
          className="w-full"
        />
      ) : (
        <Link href={`/tg/videos/${video.id}`}>
          <div className="relative aspect-video bg-gray-900 group cursor-pointer overflow-hidden">
            {video.thumbnailUrl ? (
              <Image
                src={video.thumbnailUrl}
                alt={video.news.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            )}
            
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300" />
            
            {/* Enhanced play icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-60 rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100">
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            
            {video.duration && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {formatDuration(video.duration)}
              </div>
            )}
          </div>
        </Link>
      )}
      <div className="p-4">
        <Link href={`/tg/videos/${video.id}`}>
          <h3 
            className="text-lg font-bold mb-2 transition-colors duration-200 hover:text-red-600 line-clamp-2"
            style={{ color: '#0A0A0A' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#CC0000'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#0A0A0A'}
          >
            {video.news.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.news.summary}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatDate(video.news.createdAt, "MMM dd, yyyy")}</span>
          {video.news.category && (
            <Link
              href={`/category/${video.news.category.slug}`}
              className="hover:text-red-600 transition"
            >
              {video.news.category.nameEn}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

