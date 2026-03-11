"use client";

import { useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { BreakingNewsTicker } from "@/components/ui/breaking-news-ticker";
import { HeroSection } from "./sections/hero-section";
import { EditorialSections } from "./sections/editorial-sections";
import { useLanguage } from "@/providers/LanguageProvider";
import { News, NewsResponse } from "@/types/news.types";
import { ApiResponse } from "@/types/api.types";
import { StructuredData } from "@/components/seo/StructuredData";
import { StructuredData as StructuredDataType } from "@/types/seo.types";
import { InlineAdProvider, InlineAdPlacement } from "@/components/ads/inline-ad-block";
import { useNewsInfinite } from "@/lib/hooks/useNews";
import { HomepageSection } from "@/lib/api/modules/homepage.api";
import { HomepageSections } from "./homepage-sections";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { isYouTubeUrl } from "@/lib/helpers/youtube";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { AdBanner } from "@/components/ui/ad-banner";

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
    
    // Get breaking news for ticker
    const breakingNews = safeAllNews.filter((n) => n && typeof n === 'object' && 'isBreaking' in n && n.isBreaking);
    
    // Get trending news - prioritize breaking news, then featured, then most recent
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

    // Left column stories (supporting stories)
    const leftColumnStories = safeAllNews
      .filter((n) => n && typeof n === 'object' && 'id' in n && n.id !== heroStory?.id)
      .slice(0, 6);

    // Right column stories (trending + latest)
    const rightColumnStories = safeAllNews
      .filter(
        (n) =>
          n && typeof n === 'object' && 'id' in n &&
          n.id !== heroStory?.id &&
          !leftColumnStories.some((l) => l && l.id === n.id)
      )
      .slice(0, 8);

    // Featured grid stories (for featured section)
    const featuredGrid = safeAllNews
      .filter(
        (n) =>
          n && typeof n === 'object' && 'id' in n &&
          n.id !== heroStory?.id &&
          !leftColumnStories.some((l) => l && l.id === n.id) &&
          !rightColumnStories.slice(0, 3).some((r) => r && r.id === n.id)
      )
      .slice(0, 12);

    // Latest stories grid
    const latestStories = safeAllNews
      .filter(
        (n) =>
          n && typeof n === 'object' && 'id' in n &&
          n.id !== heroStory?.id &&
          !leftColumnStories.some((l) => l && l.id === n.id) &&
          !rightColumnStories.some((r) => r && r.id === n.id)
      )
      .slice(0, 20);

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
        if (categoryStories[catId].news.length < 6) {
          categoryStories[catId].news.push(news as News);
        }
      }
    });

    // Filter videos - items with youtubeUrl or video file extensions
    const videos = safeAllNews.filter((n) => {
      if (!n || typeof n !== 'object' || !('id' in n)) return false;
      const hasYouTube = n.youtubeUrl && isYouTubeUrl(n.youtubeUrl);
      const hasVideoFile = n.mainImage && typeof n.mainImage === 'string' && n.mainImage.match(/\.(mp4|webm|ogg|mov)$/i);
      return hasYouTube || hasVideoFile;
    });

    // World news (filter by category name or use general news)
    const worldStories = safeAllNews.filter((n) => {
      if (!n || typeof n !== 'object' || !('category' in n) || !n.category) return false;
      const categoryName = n.category.nameEn?.toLowerCase() || n.category.nameIt?.toLowerCase() || '';
      return categoryName.includes('world') || categoryName.includes('mondo');
    }).slice(0, 8);

    return {
      breakingNews: Array.isArray(breakingNews) ? breakingNews : [],
      trendingNews: Array.isArray(trendingNews) ? trendingNews : [],
      heroStory,
      leftColumnStories: Array.isArray(leftColumnStories) ? leftColumnStories : [],
      rightColumnStories: Array.isArray(rightColumnStories) ? rightColumnStories : [],
      featuredGrid: Array.isArray(featuredGrid) ? featuredGrid : [],
      latestStories: Array.isArray(latestStories) ? latestStories : [],
      categoryStories,
      videos: Array.isArray(videos) ? videos : [],
      worldStories: Array.isArray(worldStories) ? worldStories : [],
    };
  }, [allNews]);

  return (
    <>
      {structuredData && <StructuredData data={structuredData} />}
      
      {/* Breaking News Ticker */}
      <BreakingNewsTicker breakingNews={newsData.breakingNews} />

      {/* Top Slider (SLIDER_TOP only) - CNN style */}
      <div className="cnn-container py-1">
        <SliderAd />
      </div>
      
      {/* Show loading state only if we have no data at all */}
      {isInfiniteFetching && (!Array.isArray(allNews) || allNews.length === 0) && !isInfiniteError ? (
        <div className="cnn-container py-12">
          <div className="flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonLoader key={index} variant="card" className="w-full" />
              ))}
            </div>
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
          {/* Render homepage sections if available, otherwise use default CNN layout */}
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
            /* NEW CNN-STYLE HOMEPAGE LAYOUT */
            <div className="space-y-0">
              {/* 3-COLUMN HERO SECTION */}
              <HeroSection
                heroStory={newsData.heroStory}
                leftColumnStories={newsData.leftColumnStories}
                rightColumnStories={newsData.rightColumnStories}
              />
              
              {/* ADVERTISEMENT BELOW HERO */}
              <div className="cnn-container py-6 flex justify-center">
                <AdBanner size="leaderboard" />
              </div>
              
              {/* EDITORIAL SECTIONS */}
              <EditorialSections
                featuredStories={newsData.featuredGrid}
                latestStories={newsData.latestStories}
                categoryStories={newsData.categoryStories}
                videoStories={newsData.videos}
                worldStories={newsData.worldStories}
              />
              
              {/*ADVERTISEMENT BETWEEN SECTIONS */}
              <div className="cnn-container py-6 flex justify-center">
                <AdBanner size="leaderboard" />
              </div>
              
              {/* Infinite Scroll Trigger */}
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
            </div>
          )}
        </>
      )}
    </>
  );
}
