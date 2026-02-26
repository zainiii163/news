"use client";

import { useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { TrendingBar } from "@/components/ui/trending-bar";
import { useLanguage } from "@/providers/LanguageProvider";
import { News, NewsResponse } from "@/types/news.types";
import { ApiResponse } from "@/types/api.types";
import { StructuredData } from "@/components/seo/StructuredData";
import { StructuredData as StructuredDataType } from "@/types/seo.types";
import { AdSlot } from "@/components/ads/ad-slot";
import { InlineAdProvider, InlineAdPlacement } from "@/components/ads/inline-ad-block";
import { TickerAd } from "@/components/ads/ticker-ad";
import { useNewsInfinite } from "@/lib/hooks/useNews";
import { HomepageSection } from "@/lib/api/modules/homepage.api";
import { HomepageSections } from "./homepage-sections";
import { HeroSection } from "./sections/hero-section";
import { FeaturedGrid } from "./sections/featured-grid";
import { CategoryBlocks } from "./sections/category-blocks";
import { VideoSection } from "./sections/video-section";
import { ShortsSection } from "./sections/shorts-section";
import { HorizontalCard, CompactCard } from "@/components/news/cnn-news-card";
import { formatDate } from "@/lib/helpers/formatDate";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { isYouTubeUrl } from "@/lib/helpers/youtube";
import Link from "next/link";

// Dynamically import ad components to avoid SSR issues
const SliderAd = dynamic(() => import("@/components/ads/slider-ad").then(mod => ({ default: mod.SliderAd })), { ssr: false });
const RegularSliderAd = dynamic(() => import("@/components/ads/regular-slider-ad").then(mod => ({ default: mod.RegularSliderAd })), { ssr: false });

interface HomeClientProps {
  allNews: News[];
  structuredData: StructuredDataType;
  sections?: HomepageSection[];
}

export function HomeClient({
  allNews: initialNews,
  structuredData,
  sections = [],
}: HomeClientProps) {
  const { t, language } = useLanguage();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Use infinite query for loading more news
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching: isInfiniteFetching,
    isError: isInfiniteError,
    error: infiniteError,
  } = useNewsInfinite({
    status: "PUBLISHED",
    limit: 12,
  });

  // Combine initial news with infinite query data
  const allNews = useMemo(() => {
    // If infinite query is still fetching first page and we have initial data, use initial data
    if (isInfiniteFetching && initialNews.length > 0) {
      return initialNews;
    }
    
    // Start with initial news (server-fetched data)
    if (!infiniteData?.pages || !Array.isArray(infiniteData.pages) || infiniteData.pages.length === 0) {
      return Array.isArray(initialNews) ? initialNews : [];
    }
    
    // Combine initial news with additional pages from infinite query
    // Ensure we always get an array
    const infiniteNews = infiniteData.pages.flatMap((page) => {
      const news = page?.data?.data?.news;
      return Array.isArray(news) ? news : [];
    });
    
    // If infinite query has data, use it but ensure we don't lose initial data
    if (Array.isArray(infiniteNews) && infiniteNews.length > 0) {
      // Start with infinite query data (first page)
      const combinedNews = [...infiniteNews];
      
      // Add any initial news that's not already in the combined data
      if (Array.isArray(initialNews)) {
        initialNews.forEach((news) => {
          if (news && typeof news === 'object' && 'id' in news && !combinedNews.some((existing) => existing?.id === news.id)) {
            combinedNews.push(news);
          }
        });
      }
      
      return combinedNews;
    }
    
    return Array.isArray(initialNews) ? initialNews : [];
  }, [infiniteData, initialNews, isInfiniteFetching]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Organize news data for CNN-style layout
  const newsData = useMemo(() => {
    // Ensure allNews is always an array
    const safeAllNews = Array.isArray(allNews) ? allNews : [];
    
    // Get trending news - prioritize breaking news, then featured, then most recent
    const breakingNews = safeAllNews.filter((n) => n && typeof n === 'object' && 'isBreaking' in n && n.isBreaking);
    const featuredNews = safeAllNews.filter((n) => n && typeof n === 'object' && 'isFeatured' in n && n.isFeatured && !n.isBreaking);
    const trendingNews = [
      ...(Array.isArray(breakingNews) ? breakingNews.slice(0, 7) : []),
      ...(Array.isArray(featuredNews) ? featuredNews.slice(0, 7 - breakingNews.length) : []),
      ...(Array.isArray(safeAllNews) ? safeAllNews
        .filter((n) => n && typeof n === 'object' && (!n.isBreaking && !n.isFeatured))
        .slice(0, 7 - breakingNews.length - featuredNews.length) : []),
    ].slice(0, 7);

    // Main featured story (center)
    const heroStory = safeAllNews.find((n) => n && typeof n === 'object' && 'isFeatured' in n && n.isFeatured) || safeAllNews[0] || null;

    // Left column stories (3-4 stories)
    const leftColumnStories = safeAllNews
      .filter((n) => n && typeof n === 'object' && 'id' in n && n.id !== heroStory?.id)
      .slice(0, 4);

    // Right column stories (for headlines section)
    const rightColumnStories = safeAllNews
      .filter(
        (n) =>
          n && typeof n === 'object' && 'id' in n &&
          n.id !== heroStory?.id &&
          !leftColumnStories.some((l) => l && l.id === n.id)
      )
      .slice(0, 8);

    // Featured grid stories (6-9 stories)
    const featuredGrid = safeAllNews
      .filter(
        (n) =>
          n && typeof n === 'object' && 'id' in n &&
          n.id !== heroStory?.id &&
          !leftColumnStories.some((l) => l && l.id === n.id) &&
          !rightColumnStories.slice(0, 3).some((r) => r && r.id === n.id)
      )
      .slice(0, 9);

    // Category-based stories
    const categoryStories: Record<
      string,
      { category: NonNullable<News["category"]>; news: News[] }
    > = {};
    safeAllNews.forEach((news) => {
      if (news && typeof news === 'object' && 'category' in news && news.category) {
        const catId = news.category.id;
        if (!categoryStories[catId]) {
          categoryStories[catId] = {
            category: news.category,
            news: [],
          };
        }
        if (categoryStories[catId].news.length < 4) {
          categoryStories[catId].news.push(news as News);
        }
      }
    });

    // More stories for horizontal cards
    const moreStories = safeAllNews
      .filter(
        (n) =>
          n && typeof n === 'object' && 'id' in n &&
          n.id !== heroStory?.id &&
          !leftColumnStories.some((l) => l && l.id === n.id) &&
          !rightColumnStories.some((r) => r && r.id === n.id) &&
          !featuredGrid.some((f) => f && f.id === n.id)
      )
      .slice(0, 6);

    // Filter videos - items with youtubeUrl or video file extensions
    const videos = safeAllNews.filter((n) => {
      if (!n || typeof n !== 'object' || !('id' in n)) return false;
      const hasYouTube = n.youtubeUrl && isYouTubeUrl(n.youtubeUrl);
      const hasVideoFile = n.mainImage && typeof n.mainImage === 'string' && n.mainImage.match(/\.(mp4|webm|ogg|mov)$/i);
      return hasYouTube || hasVideoFile;
    });

    // Shorts - same as videos but we can filter by duration or use a subset
    // For now, we'll use videos that are not in the main video section
    const shorts = videos.slice(5, 17); // Take videos after the first 5

    return {
      trendingNews: Array.isArray(trendingNews) ? trendingNews : [],
      heroStory,
      leftColumnStories: Array.isArray(leftColumnStories) ? leftColumnStories : [],
      rightColumnStories: Array.isArray(rightColumnStories) ? rightColumnStories : [],
      featuredGrid: Array.isArray(featuredGrid) ? featuredGrid : [],
      categoryStories,
      moreStories: Array.isArray(moreStories) ? moreStories : [],
      videos: Array.isArray(videos) ? videos : [],
      shorts: Array.isArray(shorts) ? shorts : [],
    };
  }, [allNews]);

  return (
    <>
      {structuredData && <StructuredData data={structuredData} />}
      <TickerAd />
      <TrendingBar trendingNews={newsData.trendingNews} />

      <div className="layout__content-wrapper layout-homepage__content-wrapper">
          {/* Top Slider (SLIDER_TOP only) - CNN style */}
          <div className="cnn-container py-1">
            <SliderAd />
          </div>
          
          {/* Show loading state only if we have no data at all */}
          {isInfiniteFetching && (!Array.isArray(allNews) || allNews.length === 0) && !isInfiniteError ? (
            <div className="cnn-container py-12">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                <p className="mt-4 text-gray-500">{t("news.loading") || "Loading..."}</p>
              </div>
            </div>
          ) : (!Array.isArray(allNews) || allNews.length === 0) && !isInfiniteFetching ? (
            <div className="cnn-container py-12">
              <div className="flex flex-col items-center justify-center">
                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t("news.noData") || "No News Available"}
                </h2>
                <p className="text-gray-600 mb-4">
                  {isInfiniteError 
                    ? t("news.errorLoading") || "Failed to load news. Please check your API configuration."
                    : t("news.noNewsFound") || "No news articles found."}
                </p>
                {isInfiniteError && infiniteError && (
                  <p className="text-sm text-gray-500 mt-2">
                    {infiniteError instanceof Error ? infiniteError.message : "Unknown error occurred"}
                  </p>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-[#c70000] text-white rounded hover:bg-[#ff0000] transition-colors"
                >
                  {t("news.reload") || "Reload Page"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Render homepage sections if available, otherwise use default layout */}
              {sections && sections.length > 0 ? (
                <>
                  <HomepageSections sections={sections} />
                  {/* Infinite Scroll Trigger - Fixed height to prevent footer jumping */}
                  <div 
                    ref={loadMoreRef} 
                    className="cnn-container mt-6 min-h-[100px] flex items-center justify-center"
                  >
                    {isFetchingNextPage && (
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                        <p className="mt-4 text-sm text-gray-500">{t("news.loading") || "Loading more articles..."}</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
            /* CNN-Style Default Layout - 4 INLINE ads (different ones) via InlineAdProvider */
            <div className="container_ribbon">
              <div className="cnn-container">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 lg:gap-4">
                  {/* Main Content - 3 columns on desktop, full on mobile */}
                  <div className="lg:col-span-3">
                    <InlineAdProvider>
                    {/* Hero Section */}
                    <HeroSection
                      heroStory={newsData.heroStory || null}
                      leftColumnStories={newsData.leftColumnStories}
                      rightColumnStories={newsData.rightColumnStories}
                    />

                    {/* Mid-Page Ad - CNN style */}
                    <div className="py-3">
                      <AdSlot slot="MID_PAGE" />
                    </div>

                    {/* Inline Ad 1 - CNN style */}
                    <div className="py-1">
                      <InlineAdPlacement index={0} />
                    </div>

                    {/* Normal Slider (SLIDER only) - CNN style */}
                    <div className="px-1 py-1">
                      <RegularSliderAd />
                    </div>

                    {/* Featured Grid Section (In Evidenza / highlighted news) */}
                    {newsData.featuredGrid.length > 0 && (
                      <>
                        <FeaturedGrid
                          news={newsData.featuredGrid}
                          title={t("news.inEvidenza")}
                          columns={3}
                        />

                        {/* Between Sections Ad (slot 1) - CNN style */}
                        <div className="py-2">
                          <AdSlot slot="BETWEEN_SECTIONS_1" />
                        </div>
                        {/* Inline Ad 2 - CNN style */}
                        <div className="py-1">
                          <InlineAdPlacement index={1} />
                        </div>
                      </>
                    )}

                    {/* Category Blocks */}
                    {Object.keys(newsData.categoryStories).length > 0 && (
                      <>
                        <CategoryBlocks
                          categoryStories={newsData.categoryStories}
                          maxPerCategory={4}
                        />

                        {/* Between Sections Ad (slot 2) - CNN style */}
                        <div className="py-3">
                          <AdSlot slot="BETWEEN_SECTIONS_2" />
                        </div>
                        {/* Inline Ad 3 - CNN style */}
                        <div className="py-1">
                          <InlineAdPlacement index={2} />
                        </div>
                      </>
                    )}

                    {/* Video Section */}
                    {newsData.videos.length > 0 && (
                      <>
                        <VideoSection videos={newsData.videos} title={t("news.videos") || "Videos"} />

                        {/* Between Sections Ad - CNN style */}
                        <div className="py-3">
                          <AdSlot slot="BETWEEN_SECTIONS" />
                        </div>
                        {/* Inline Ad - CNN style */}
                        <div className="py-1">
                          <InlineAdPlacement index={4} />
                        </div>
                      </>
                    )}

                    {/* Shorts Section */}
                    {newsData.shorts.length > 0 && (
                      <>
                        <ShortsSection shorts={newsData.shorts} title={t("news.shorts") || "Shorts"} />

                        {/* Between Sections Ad - CNN style */}
                        <div className="py-3">
                          <AdSlot slot="BETWEEN_SECTIONS" />
                        </div>
                        {/* Inline Ad - CNN style */}
                        <div className="py-1">
                          <InlineAdPlacement index={5} />
                        </div>
                      </>
                    )}

                    {/* More Stories - Horizontal Cards - CNN style */}
                    {newsData.moreStories.length > 0 && (
                      <>
                        <div className="py-4 border-t border-gray-200">
                          <div className="mb-3">
                            <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide">
                              {t("news.altreNotizie")}
                            </h2>
                          </div>
                          <div className="space-y-0">
                            {newsData.moreStories.map((story) => (
                              <HorizontalCard key={story.id} news={story} />
                            ))}
                          </div>
                        </div>

                        {/* Inline Ad - CNN style */}
                        <div className="py-1">
                          <InlineAdPlacement index={3} />
                        </div>
                      </>
                    )}

                    {/* Additional Featured Grid - CNN style */}
                    {Array.isArray(allNews) && allNews.length > 20 && (
                      <>
                        <FeaturedGrid
                          news={allNews
                            .filter(
                              (n) =>
                                n && typeof n === 'object' && 'id' in n &&
                                (!newsData.heroStory || n.id !== newsData.heroStory.id)
                            )
                            .slice(15, 24)}
                          title={t("news.continueReading")}
                          columns={4}
                        />
                        {/* Between Sections Ad - CNN style */}
                        <div className="py-3">
                          <AdSlot slot="BETWEEN_SECTIONS_3" />
                        </div>
                        {/* Inline Ad - CNN style */}
                        <div className="py-1">
                          <InlineAdPlacement index={6} />
                        </div>
                      </>
                    )}

                    {/* Infinite Scroll Trigger - Fixed height to prevent footer jumping */}
                    <div 
                      ref={loadMoreRef} 
                      className="mt-6 min-h-[100px] flex items-center justify-center"
                    >
                      {isFetchingNextPage && (
                        <div className="flex flex-col items-center justify-center py-6">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
                          <p className="mt-4 text-sm text-gray-500">{t("news.loading") || "Loading more articles..."}</p>
                        </div>
                      )}
                    </div>
                    </InlineAdProvider>
                  </div>

                  {/* Right Sidebar - 1 column - CNN Style */}
                  <aside className="lg:col-span-1">
                  <div className="sticky top-24 space-y-6" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                    {/* Sidebar Ad */}
                    <div className="bg-white pl-4" style={{ borderLeft: '1px solid #e6e6e6' }}>
                      <AdSlot slot="SIDEBAR" />
                    </div>

                    {/* Trending Articles Sidebar - CNN Style */}
                    <div className="bg-white pl-4" style={{ borderLeft: '1px solid #e6e6e6' }}>
                      <div 
                        className="mb-4 pb-3"
                        style={{
                          borderBottom: '1px solid #e6e6e6',
                          fontSize: '13px',
                          fontWeight: 700,
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          color: '#0A0A0A',
                        }}
                      >
                        {language === "it" ? "IN EVIDENZA" : "TRENDING"}
                      </div>
                      <div className="space-y-0">
                        {(Array.isArray(newsData.trendingNews) ? newsData.trendingNews.slice(0, 5) : []).map((article, index) => (
                          <div 
                            key={article?.id || index} 
                            className="py-3"
                            style={{ 
                              borderBottom: index < (Array.isArray(newsData.trendingNews) ? newsData.trendingNews.slice(0, 5) : []).length - 1 ? '1px solid #f0f0f0' : 'none'
                            }}
                          >
                            <Link
                              href={`/news/${article.slug || article.id}`}
                              className="block group"
                              style={{
                                fontSize: '14px',
                                fontWeight: 400,
                                lineHeight: '1.5',
                                color: '#0A0A0A',
                                textDecoration: 'none',
                                transition: 'color 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#CC0000';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#0A0A0A';
                              }}
                            >
                              <span className="line-clamp-3">{article.title}</span>
                            </Link>
                            <div 
                              className="mt-2"
                              style={{
                                fontSize: '11px',
                                fontWeight: 400,
                                color: '#6B6B6B',
                                letterSpacing: '0.2px',
                              }}
                            >
                              {formatDate(article.publishedAt || article.createdAt, "MMM dd")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Most Recent - CNN-style vertical feed with images */}
                    <div className="bg-white pl-4" style={{ borderLeft: '1px solid #e6e6e6' }}>
                      <div 
                        className="mb-4 pb-3"
                        style={{
                          borderBottom: '1px solid #e6e6e6',
                          fontSize: '13px',
                          fontWeight: 700,
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          color: '#0A0A0A',
                        }}
                      >
                        {language === "it" ? "ULTIME NOTIZIE" : "LATEST NEWS"}
                      </div>
                      <div className="space-y-0">
                        {(Array.isArray(allNews) ? allNews.slice(0, 6) : []).map((article, index) => (
                          <div
                            key={article.id}
                            className="py-3"
                            style={{
                              borderBottom: index < (Array.isArray(allNews) ? allNews.slice(0, 6) : []).length - 1 ? '1px solid #f0f0f0' : 'none',
                            }}
                          >
                            <Link
                              href={`/news/${article.slug || article.id}`}
                              className="flex gap-3 group"
                              style={{
                                textDecoration: 'none',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              {/* Small thumbnail - CNN style */}
                              {article.mainImage && article.mainImage.trim() !== "" && (
                                <div 
                                  className="relative flex-shrink-0 overflow-hidden"
                                  style={{
                                    width: '80px',
                                    height: '60px',
                                    backgroundColor: '#f0f0f0',
                                  }}
                                >
                                  <OptimizedImage
                                    src={getImageUrl(article.mainImage)}
                                    alt={article.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    quality={75}
                                    sizes="80px"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3
                                  className="line-clamp-2"
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: 400,
                                    lineHeight: '1.5',
                                    color: '#0A0A0A',
                                    transition: 'color 0.15s ease',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#CC0000';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#0A0A0A';
                                  }}
                                >
                                  {article.title}
                                </h3>
                                <div
                                  className="mt-1.5"
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 400,
                                    color: '#6B6B6B',
                                    letterSpacing: '0.2px',
                                  }}
                                >
                                  {formatDate(article.publishedAt || article.createdAt, "MMM dd")}
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  </aside>
                </div>
              </div>
            </div>
              )}
            </>
          )}
      </div>
    </>
  );
}
