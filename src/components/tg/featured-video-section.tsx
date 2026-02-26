"use client";

import { usePopularTGVideos } from "@/lib/hooks/useTG";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";
import Link from "next/link";
import { formatDate } from "@/lib/helpers/formatDate";
import { TGVideosResponse } from "@/lib/api/modules/tg.api";
import Image from "next/image";

interface VideoThumbnailProps {
  video: any;
  isLarge?: boolean;
}

function VideoThumbnail({ video, isLarge = false }: VideoThumbnailProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Link href={`/tg/videos/${video.id}`} className="block group">
      <div className={`relative ${isLarge ? 'aspect-video' : 'aspect-video'} bg-gray-900 overflow-hidden`}>
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
        
        {/* Duration label */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>
    </Link>
  );
}

export function FeaturedVideoSection() {
  const { data, isLoading, error } = usePopularTGVideos(4); // Get 4 videos for featured + 3 smaller

  if (isLoading) {
    return (
      <div className="mb-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <ErrorMessage error={error} />
      </div>
    );
  }

  const videos = (data as TGVideosResponse | undefined)?.data?.videos || [];

  if (!videos || videos.length === 0) {
    return null;
  }

  const featuredVideo = videos[0];
  const smallerVideos = videos.slice(1, 4); // Take next 3 videos

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold leading-tight mb-6 text-gray-900">Featured Videos</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Featured Video */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-none shadow-none overflow-hidden">
            <VideoThumbnail video={featuredVideo} isLarge={true} />
            <div className="p-4">
              <Link href={`/tg/videos/${featuredVideo.id}`}>
                <h3 
                  className="text-xl font-bold leading-tight text-gray-900 mb-3 transition-colors duration-200 hover:text-red-600"
                  style={{ color: '#0A0A0A' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#CC0000'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0A0A0A'}
                >
                  {featuredVideo.news.title}
                </h3>
              </Link>
              <p className="text-gray-700 mb-4 line-clamp-2">{featuredVideo.news.summary}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{formatDate(featuredVideo.news.createdAt, "MMM dd, yyyy")}</span>
                {featuredVideo.news.category && (
                  <Link
                    href={`/category/${featuredVideo.news.category.slug}`}
                    className="hover:text-red-600 transition"
                  >
                    {featuredVideo.news.category.nameEn}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Smaller Videos */}
        <div className="lg:col-span-4">
          <div className="space-y-4">
            {smallerVideos.map((video, index) => (
              <div key={video.id} className="bg-white rounded-none shadow-none overflow-hidden">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-1/2">
                    <VideoThumbnail video={video} isLarge={false} />
                  </div>
                  <div className="flex-1 p-3">
                    <Link href={`/tg/videos/${video.id}`}>
                      <h4 
                        className="text-sm font-bold leading-tight text-gray-900 mb-2 transition-colors duration-200 hover:text-red-600 line-clamp-2"
                        style={{ color: '#0A0A0A' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#CC0000'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#0A0A0A'}
                      >
                        {video.news.title}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatDate(video.news.createdAt, "MMM dd")}</span>
                      {video.duration && (
                        <>
                          <span>•</span>
                          <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, "0")}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

