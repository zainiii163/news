"use client";

import { useState } from "react";
import { useNews } from "@/lib/hooks/useNews";
import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { isYouTubeUrl, getYouTubeThumbnail } from "@/lib/helpers/youtube";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { InlineAdProvider, InlineAdPlacement } from "@/components/ads/inline-ad-block";

// Helper function to format video duration
function formatVideoDuration(duration?: string | number): string {
  if (!duration) return "0:00";
  if (typeof duration === "number") {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
  return duration;
}

// Helper function to get news URL - prioritizes slug, falls back to id
function getNewsUrl(news: News): string {
  if (news.slug) {
    return `/news/${news.slug}`;
  }
  return `/news/${news.id}`;
}

interface NewsListingClientProps {
  initialNews: News[];
  initialPage: number;
}

export function NewsListingClient({
  initialNews,
  initialPage,
}: NewsListingClientProps) {
  const [page, setPage] = useState(initialPage);

  // Fetch news with pagination
  const { data, isLoading } = useNews({
    page,
    limit: 20,
    status: "PUBLISHED",
  });

  const newsList = (data as any)?.data?.data?.news || initialNews;
  const meta = (data as any)?.data?.data?.meta;

  // Split news: main story + list articles + grid
  const mainStory = newsList[0];
  const listArticles = newsList.slice(1, 6);
  const gridArticles = newsList.slice(6);

  return (
    <InlineAdProvider>
      <div className="container_ribbon">
        <div className="cnn-container py-6">
          {/* Section Header - CNN Style */}
          <div className="mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-black"></div>
            <h1 className="text-xs font-[800] uppercase tracking-[0.1em] text-black">
              All News
            </h1>
          </div>

          {isLoading && initialNews.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full h-[200px] bg-gray-200 mb-3"></div>
                  <div className="h-4 bg-gray-200 mb-2"></div>
                  <div className="h-4 bg-gray-200 w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Main Story + List Layout - CNN Style */}
              {newsList.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                  {/* Main Story - Left Column (8 cols) */}
                  <div className="lg:col-span-8">
                    {mainStory && (
                      <Link href={getNewsUrl(mainStory)}>
                        <div className="group cursor-pointer mb-6">
                          <div className="relative w-full h-[400px] mb-4 overflow-hidden">
                            {(mainStory.youtubeUrl && isYouTubeUrl(mainStory.youtubeUrl)) ? (
                              <div className="relative w-full h-full">
                                <OptimizedImage
                                  src={getYouTubeThumbnail(mainStory.youtubeUrl, "maxres") || ""}
                                  alt={mainStory.title}
                                  fill
                                  className="object-cover"
                                  priority
                                  quality={90}
                                />
                                <div className="absolute bottom-3 left-3 bg-black/80 text-white px-2 py-1 text-xs font-semibold">
                                  {formatVideoDuration()}
                                </div>
                              </div>
                            ) : mainStory.mainImage && mainStory.mainImage.trim() !== "" ? (
                              mainStory.mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                                <div className="relative w-full h-full">
                                  <video
                                    src={getImageUrl(mainStory.mainImage)}
                                    className="w-full h-full object-cover"
                                    muted
                                    playsInline
                                    preload="metadata"
                                  />
                                  <div className="absolute bottom-3 left-3 bg-black/80 text-white px-2 py-1 text-xs font-semibold">
                                    {formatVideoDuration()}
                                  </div>
                                </div>
                              ) : (
                                <OptimizedImage
                                  src={getImageUrl(mainStory.mainImage)}
                                  alt={mainStory.title}
                                  fill
                                  className="object-cover"
                                  priority
                                  quality={90}
                                />
                              )
                            ) : (
                              <div className="w-full h-full bg-gray-200"></div>
                            )}
                          </div>
                          <h2 className="text-[2rem] leading-[1.1] font-[900] text-black mb-3 group-hover:text-[#CC0000] transition-colors line-clamp-3 tracking-tight">
                            {mainStory.title}
                          </h2>
                          {mainStory.summary && (
                            <p className="text-base text-[#4D4D4D] leading-[1.6] mb-3 line-clamp-3">
                              {mainStory.summary}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-[#666666] uppercase tracking-wide">
                            {mainStory.category && (
                              <>
                                <span className="font-semibold text-[#CC0000]">
                                  {mainStory.category.nameEn}
                                </span>
                                <span className="text-[#999999]">•</span>
                              </>
                            )}
                            <span>{formatRelativeTime(mainStory.createdAt)}</span>
                          </div>
                        </div>
                      </Link>
                    )}

                    {/* Text-Only List Articles - CNN Style */}
                    {listArticles.length > 0 && (
                      <div className="space-y-0 border-t border-[#E6E6E6] pt-4">
                        {listArticles.map((story: News, index: number) => (
                          <Link key={story.id} href={getNewsUrl(story)}>
                            <div className={`py-3 border-b border-[#E6E6E6] group cursor-pointer hover:bg-[#FAFAFA] transition-colors ${index === listArticles.length - 1 ? 'border-b-0' : ''}`}>
                              <h3 className="text-base leading-[1.3] font-[800] text-black group-hover:text-[#CC0000] transition-colors line-clamp-2">
                                {story.title}
                              </h3>
                              <p className="text-xs text-[#666666] mt-1">
                                {formatRelativeTime(story.createdAt)}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Sidebar (4 cols) */}
                  <div className="lg:col-span-4 space-y-6">
                    <AdSlot slot="SIDEBAR" />
                  </div>
                </div>
              )}

              {/* Inline Ad After Main Section */}
              {newsList.length > 0 && <InlineAdPlacement index={0} />}

              {/* More Stories Grid - CNN Style */}
              {gridArticles.length > 0 && (
                <>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-black"></div>
                    <h2 className="text-xs font-[800] uppercase tracking-[0.1em] text-black">
                      More Stories
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {gridArticles.map((story: News) => (
                      <Link key={story.id} href={getNewsUrl(story)}>
                        <div className="group cursor-pointer">
                          <div className="relative w-full h-[200px] mb-3 overflow-hidden">
                            {(story.youtubeUrl && isYouTubeUrl(story.youtubeUrl)) ? (
                              <div className="relative w-full h-full">
                                <OptimizedImage
                                  src={getYouTubeThumbnail(story.youtubeUrl, "high") || ""}
                                  alt={story.title}
                                  fill
                                  className="object-cover"
                                  quality={85}
                                  loading="lazy"
                                />
                                <div className="absolute bottom-2 left-2 bg-black/80 text-white px-1.5 py-0.5 text-[10px] font-semibold">
                                  {formatVideoDuration()}
                                </div>
                              </div>
                            ) : story.mainImage && story.mainImage.trim() !== "" ? (
                              story.mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                                <div className="relative w-full h-full">
                                  <video
                                    src={getImageUrl(story.mainImage)}
                                    className="w-full h-full object-cover"
                                    muted
                                    playsInline
                                    preload="metadata"
                                  />
                                  <div className="absolute bottom-2 left-2 bg-black/80 text-white px-1.5 py-0.5 text-[10px] font-semibold">
                                    {formatVideoDuration()}
                                  </div>
                                </div>
                              ) : (
                                <OptimizedImage
                                  src={getImageUrl(story.mainImage)}
                                  alt={story.title}
                                  fill
                                  className="object-cover"
                                  quality={85}
                                  loading="lazy"
                                />
                              )
                            ) : (
                              <div className="w-full h-full bg-gray-200"></div>
                            )}
                          </div>
                          <h3 className="text-lg leading-[1.3] font-[800] text-black mb-2 group-hover:text-[#CC0000] transition-colors line-clamp-2">
                            {story.title}
                          </h3>
                          {story.summary && (
                            <p className="text-sm text-[#4D4D4D] leading-[1.5] mb-2 line-clamp-2">
                              {story.summary}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-[#666666]">
                            {story.category && (
                              <>
                                <span className="text-[#CC0000] font-[600] uppercase tracking-wide">
                                  {story.category.nameEn}
                                </span>
                                <span className="text-[#999999]">•</span>
                              </>
                            )}
                            <span>{formatRelativeTime(story.createdAt)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* Pagination - CNN Style */}
              {meta && meta.totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2 border-t border-[#E6E6E6] pt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-[#E6E6E6] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAFAFA] transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-[#666666]">
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={page === meta.totalPages}
                    className="px-4 py-2 border border-[#E6E6E6] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAFAFA] transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </InlineAdProvider>
  );
}
