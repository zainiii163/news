"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { NewsCard } from "@/components/ui/news-card";
import { useNewsDetail, useNews } from "@/lib/hooks/useNews";
import { useLanguage } from "@/providers/LanguageProvider";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { formatDate, formatRelativeTime } from "@/lib/helpers/formatDate";
import Link from "next/link";
import { seoApi } from "@/lib/api/modules/seo.api";
import { StructuredData } from "@/components/seo/StructuredData";
import { SocialShareButtons } from "@/components/news/social-share-buttons";
import { ImageGallery } from "@/components/news/image-gallery";
import { AdSlot } from "@/components/ads/ad-slot";
import { InlineAdProvider, InlineAdPlacement } from "@/components/ads/inline-ad-block";
import { SidebarTrending } from "@/components/news/sidebar-trending";
import { BookmarkButton } from "@/components/bookmarks/bookmark-button";
import { useMediaStatus } from "@/lib/hooks/useMediaStatus";
import { News, NewsDetail } from "@/types/news.types";
import { StructuredData as StructuredDataType } from "@/types/seo.types";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { isYouTubeUrl, getYouTubeEmbedUrl } from "@/lib/helpers/youtube";
import { SidebarListItem } from "@/components/news/sidebar-list-item";

// Helper function to check if breaking news is still fresh (within 1 hour)
function isBreakingNewsFresh(createdAt: string | Date): boolean {
  const now = new Date();
  const created = new Date(createdAt);
  const hoursSinceCreation = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return hoursSinceCreation <= 1; // Hide after 1 hour
}

interface NewsDetailClientProps {
  initialNews: News | NewsDetail | null;
  initialStructuredData?: StructuredDataType | null;
  initialRelatedNews?: News[];
}

export function NewsDetailClient({
  initialNews,
  initialStructuredData,
  initialRelatedNews = [],
}: NewsDetailClientProps) {
  const params = useParams();
  const idOrSlug = params?.id as string;
  const { language, t, formatNumber } = useLanguage();

  // Note: Breaking badge freshness is checked without periodic updates
  // The component will re-render when news data changes

  // Use initial data or fetch if needed
  const { data: newsData, isLoading, error } = useNewsDetail(idOrSlug);
  // Extract NewsDetail from response: newsData is { data: NewsDetail }, so newsData.data is NewsDetail
  // Type assertion to properly extract NewsDetail from the API response
  const fetchedNews = (newsData as { data?: NewsDetail } | undefined)?.data;
  const news: News | NewsDetail | null = fetchedNews || initialNews;

  // Fetch structured data for news article
  const [structuredData, setStructuredData] =
    useState<StructuredDataType | null>(initialStructuredData || null);

  useEffect(() => {
    const fetchStructuredData = async () => {
      if (news?.slug && !initialStructuredData) {
        try {
          const response = await seoApi.getNewsStructuredData(news.slug);
          if (response.success && response.data) {
            setStructuredData(response.data.data);
          }
        } catch (error) {
          console.error("Failed to fetch news structured data:", error);
        }
      }
    };

    fetchStructuredData();
  }, [news?.slug, initialStructuredData]);

  // Note: Page view tracking is handled by BehaviorTracker component
  // No need to track here to avoid duplicate tracking

  // Fetch related news from the same category
  const { data: relatedNewsData } = useNews({
    categoryId: news?.category?.id,
    status: "PUBLISHED",
    limit: 4,
  });

  const relatedNews =
    (relatedNewsData as any)?.data?.data?.news?.filter((n: News) => n.id !== news?.id).slice(0, 3) ||
    initialRelatedNews;

  // Check media status for main image
  const mainImageUrl = news?.mainImage;
  const isMediaLibraryUrl =
    mainImageUrl?.startsWith("/uploads/") ||
    mainImageUrl?.includes("/uploads/");
  const { data: mediaStatusData } = useMediaStatus(
    isMediaLibraryUrl ? mainImageUrl : null
  );
  const mediaStatus = mediaStatusData?.data?.data?.status;
  const shouldShowFallback =
    mediaStatus === "FAILED" || mediaStatus === "PENDING";

  // Fetch related news by same author
  const { data: authorNewsData } = useNews({
    status: "PUBLISHED",
    limit: 10,
  });

  const relatedByAuthor = news?.author?.id
    ? (authorNewsData as any)?.data?.data?.news
        ?.filter((n: News) => n.id !== news?.id && n.author?.id === news.author?.id)
        .slice(0, 4) || []
    : [];

  if (isLoading && !initialNews) {
    return (
      <div className="cnn-container py-6">
        <Loading />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="cnn-container py-8 text-center">
          {error && <ErrorMessage error={error} className="mb-4" />}
          <h1 className="text-4xl font-extrabold mb-2 text-gray-900">
            {t("news.noNews")}
          </h1>
          <p className="text-base text-gray-700 mb-3">
            {language === "it"
              ? "L'articolo che stai cercando non esiste o è stato rimosso."
              : "The news article you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition"
          >
            {t("nav.home")}
          </Link>
        </div>
    );
  }

  const categoryName = news.category
    ? language === "it" ? news.category.nameIt : news.category.nameEn
    : "";
  const frontendUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

  return (
    <>
      {structuredData && (
        <StructuredData data={structuredData} id="news-structured-data" />
      )}
      <div className="container_ribbon -my-6">
        <div className="cnn-container py-6">
          <InlineAdProvider>
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
              <article className="lg:col-span-7">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link href="/" className="hover:text-red-600 transition">
                  {t("nav.home")}
                </Link>
                <span>/</span>
                {news.category && (
                  <>
                    <Link
                      href={`/category/${news.category.slug}`}
                      className="hover:text-red-600 transition"
                    >
                      {categoryName}
                    </Link>
                    <span>/</span>
                  </>
                )}
                <span className="text-gray-900 font-medium line-clamp-1">
                  {news.title}
                </span>
              </div>

              {/* Category and Date */}
              <div className="text-sm text-gray-500 border-b border-gray-200 pb-3 mb-4">
                {news.category && (
                  <Link
                    href={`/category/${news.category.slug}`}
                    className="inline-block text-red-600 font-black uppercase tracking-wider hover:text-red-700 mr-3"
                  >
                    {categoryName}
                  </Link>
                )}
                <span>
                  {formatDate(
                    news.publishedAt || news.createdAt,
                    "MMMM dd, yyyy"
                  )}{" "}
                  • {formatRelativeTime(news.publishedAt || news.createdAt)}
                </span>
              </div>

              {/* Author and Date */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="font-medium">
                  {t("news.writtenBy")} {news.author?.name || "Editor"}
                </span>
                <span>•</span>
                <span>
                  {formatDate(
                    news.publishedAt || news.createdAt,
                    "MMMM dd, yyyy"
                  )}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-[40px] font-bold leading-tight mb-4" style={{ color: '#0A0A0A' }}>
                {news.title}
              </h1>

              {/* Social Share Buttons and Bookmark */}
              <div className="mb-3 flex items-center gap-3">
                <SocialShareButtons
                  url={`${frontendUrl}/news/${news.slug || news.id}`}
                  title={news.title}
                  description={news.summary || ""}
                />
                <BookmarkButton newsId={news.id} />
              </div>

              {/* Summary */}
              {news.summary && (
                <p className="text-lg text-gray-700 mb-4 leading-relaxed max-w-4xl">
                  {news.summary}
                </p>
              )}

              {/* Breaking Badge */}
              {news.isBreaking && isBreakingNewsFresh(news.createdAt) && (
                <div className="mb-4">
                  <span className="inline-block bg-red-600 text-white px-4 py-2 text-sm font-bold">
                    {t("news.breaking")}
                  </span>
                </div>
              )}

              {/* YouTube Video Embed */}
              {news.youtubeUrl && news.youtubeUrl.trim() !== "" && isYouTubeUrl(news.youtubeUrl) && (
                <div className="relative w-full h-96 md:h-[500px] mb-4 overflow-hidden bg-gray-900">
                  <iframe
                    src={getYouTubeEmbedUrl(news.youtubeUrl) || ""}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={news.title}
                  />
                </div>
              )}

              {/* Main Image/Video */}
              {news.mainImage &&
                news.mainImage.trim() !== "" &&
                !shouldShowFallback &&
                !(news.youtubeUrl && isYouTubeUrl(news.youtubeUrl)) && (
                  <div className="relative w-full h-96 md:h-[500px] mb-6 overflow-hidden">
                    {news.mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                      <video
                        src={getImageUrl(news.mainImage)}
                        controls
                        className="w-full h-full object-cover"
                        playsInline
                        preload="metadata"
                      >
                        Your browser does not support video tag.
                      </video>
                    ) : (
                      <OptimizedImage
                        src={getImageUrl(news.mainImage)}
                        alt={news.title}
                        fill
                        className="object-cover"
                        priority
                        loading="eager"
                        quality={85}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                      />
                    )}
                  </div>
                )}
              {/* Fallback for rejected/pending media */}
              {news.mainImage && shouldShowFallback && (
                <div className="relative w-full h-96 md:h-[500px] mb-3 overflow-hidden bg-gray-200 flex items-center justify-center">
                  <div className="text-center p-8">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-600 font-medium">
                      {mediaStatus === "FAILED"
                        ? language === "it"
                          ? "Immagine non disponibile (rifiutata)"
                          : "Image not available (rejected)"
                        : language === "it"
                        ? "Immagine in attesa di approvazione"
                        : "Image pending approval"}
                    </p>
                  </div>
                </div>
              )}

              {/* Image Gallery - Only show if there are additional images beyond the main image */}
              <ImageGallery
                content={news.content}
                mainImage={news.mainImage}
                className="mb-3"
              />

              {/* Inline Ad 1 - within article (same type as homepage) */}
              <InlineAdPlacement index={0} />

              {/* Content - Article Body */}
              <div
                className="article-content max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />

              {/* Inline Ad 2 */}
              <InlineAdPlacement index={1} />

              {/* Author and Metadata */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">
                      {t("news.writtenBy")}
                    </p>
                    <p className="font-extrabold text-gray-900">
                      {news.author?.name || "Editor"}
                    </p>
                  </div>
                  {news.views !== undefined && (
                    <div className="text-sm text-gray-500">
                      {formatNumber(news.views)} {t("admin.views")}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags (if available) */}
              {news.tags && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {news.tags.split(",").map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Inline Ad 3 */}
              <InlineAdPlacement index={2} />
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-3">
              <div className="sticky top-24 space-y-4">
                {/* Trending Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <h3 className="font-bold text-sm mb-3 pb-2 border-b border-gray-200" style={{ color: '#0A0A0A' }}>
                    {language === "it" ? "TRENDING" : "TRENDING"}
                  </h3>
                  <SidebarTrending excludeId={news.id} limit={5} />
                </div>

                {/* Most Read Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <h3 className="font-bold text-sm mb-3 pb-2 border-b border-gray-200" style={{ color: '#0A0A0A' }}>
                    {language === "it" ? "MOST READ" : "MOST READ"}
                  </h3>
                  <SidebarTrending excludeId={news.id} limit={5} />
                </div>

                {/* Editor Picks Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <h3 className="font-bold text-sm mb-3 pb-2 border-b border-gray-200" style={{ color: '#0A0A0A' }}>
                    {language === "it" ? "EDITOR PICKS" : "EDITOR PICKS"}
                  </h3>
                  <div className="space-y-1">
                    {relatedNews.slice(0, 5).map((related: News, index: number) => (
                      <SidebarListItem
                        key={related.id}
                        item={related}
                        index={index}
                      />
                    ))}
                  </div>
                </div>

                {/* Sponsored Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <h3 className="font-bold text-sm mb-3 pb-2 border-b border-gray-200" style={{ color: '#0A0A0A' }}>
                    {language === "it" ? "SPONSORED" : "SPONSORED"}
                  </h3>
                  <div className="space-y-1">
                    {relatedByAuthor.slice(0, 5).map((related: News, index: number) => (
                      <SidebarListItem
                        key={related.id}
                        item={related}
                        index={index}
                        showSponsored={true}
                        sponsoredLabel={language === "it" ? "Sponsorizzato" : "Sponsored"}
                      />
                    ))}
                  </div>
                </div>

                {/* Advertisement Placeholder */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <div className="text-gray-500 text-xs font-medium mb-2">
                    {language === "it" ? "PUBBLICITÀ" : "ADVERTISEMENT"}
                  </div>
                  <div className="bg-gray-200 rounded h-48 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">
                      {language === "it" ? "Spazio pubblicitario" : "Ad Space"}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Inline Ad 4 - below article, above Related News */}
          <div className="mt-3">
            <InlineAdPlacement index={3} />
          </div>
            </InlineAdProvider>
          </div>
        </div>
    </>
  );
}
