"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useNews } from "@/lib/hooks/useNews";
import { useLanguage } from "@/providers/LanguageProvider";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";
import Link from "next/link";
import { RelatedCategories } from "@/components/category/related-categories";
import { StructuredData } from "@/components/seo/StructuredData";
import { StructuredData as StructuredDataType } from "@/types/seo.types";
import { seoApi } from "@/lib/api/modules/seo.api";
import { useCategories } from "@/lib/hooks/useCategories";
import { getSubcategories, getParentCategory, getCategoryPath } from "@/lib/helpers/category-helpers";
import { Category } from "@/types/category.types";
import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { isYouTubeUrl, getYouTubeThumbnail } from "@/lib/helpers/youtube";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import { AdSlot } from "@/components/ads/ad-slot";
import { InlineAdProvider, InlineAdPlacement } from "@/components/ads/inline-ad-block";

// Helper function to get news URL
function getNewsUrl(news: News): string {
  if (news.slug) {
    return `/news/${news.slug}`;
  }
  return `/news/${news.id}`;
}

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

interface CategoryClientProps {
  category: Category | null;
  initialNews: News[];
  structuredData?: StructuredDataType | null;
}

export function CategoryClient({ category, initialNews, structuredData: initialStructuredData }: CategoryClientProps) {
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  // Initialize page from searchParams directly
  const pageParam = searchParams?.get("page");
  const [page, setPage] = useState(() => {
    return pageParam ? Number(pageParam) || 1 : 1;
  });
  const [structuredData, setStructuredData] = useState<StructuredDataType | null>(initialStructuredData || null);
  
  useEffect(() => {
    const currentPageParam = searchParams?.get("page");
    if (currentPageParam) {
      const newPage = Number(currentPageParam) || 1;
      if (newPage !== page) {
        // Use requestAnimationFrame to defer state update
        requestAnimationFrame(() => {
          setPage(newPage);
        });
      }
    }
  }, [searchParams, page]);
  
  const { data: categoriesData } = useCategories();
  const allCategories = useMemo(() => categoriesData?.data?.data || [], [categoriesData]);
  
  const subcategories = useMemo(() => {
    if (!category || !category.id || !allCategories.length) return [];
    return getSubcategories(category.id, allCategories);
  }, [category, allCategories]);
  
  const parentCategory = useMemo(() => {
    if (!category || !category.parentId || !allCategories.length) return null;
    return getParentCategory(category.parentId, allCategories);
  }, [category, allCategories]);
  
  const categoryPath = useMemo(() => {
    if (!category || !allCategories.length) return [];
    return getCategoryPath(category, allCategories);
  }, [category, allCategories]);

  useEffect(() => {
    if (!initialStructuredData && category?.slug) {
      const fetchStructuredData = async () => {
        try {
          const response = await seoApi.getCategoryStructuredData(category.slug);
          if (response.success && response.data) {
            setStructuredData(response.data as unknown as StructuredDataType);
          }
        } catch (error) {
          console.error("Failed to fetch category structured data:", error);
        }
      };
      fetchStructuredData();
    }
  }, [category?.slug, initialStructuredData]);

  const {
    data: newsData,
    isLoading: newsLoading,
    error: newsError,
  } = useNews({
    categoryId: category?.id,
    status: "PUBLISHED",
    page,
    limit: 20,
  });

  const categoryNews = newsData?.data?.data?.news || initialNews || [];
  const categoryName = category 
    ? (language === "it" ? category.nameIt : category.nameEn)
    : null;
  const categoryDescription = category?.description || null;
  const meta = newsData?.data?.data?.meta;

  // Split news: main story + list articles
  const mainStory = categoryNews[0];
  const listArticles = categoryNews.slice(1, 6);
  const gridArticles = categoryNews.slice(6);

  if (newsLoading && page === 1 && initialNews.length === 0) {
    return (
      <div className="container_ribbon">
        <div className="cnn-container py-6">
          <Loading />
        </div>
      </div>
    );
  }

  if (newsError && page === 1 && initialNews.length === 0) {
    return (
      <div className="container_ribbon">
        <div className="cnn-container py-6">
          <ErrorMessage error={newsError} />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container_ribbon">
        <div className="cnn-container py-8 text-center">
          <h1 className="text-4xl font-[900] mb-4 text-black">Category Not Found</h1>
          <p className="text-[#4D4D4D] mb-6">
            The category you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#CC0000] text-white hover:bg-[#B30000] transition"
          >
            {t("nav.home")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <InlineAdProvider>
      {structuredData && <StructuredData data={structuredData} id="category-structured-data" />}
      <div className="container_ribbon">
        <div className="cnn-container py-6">
          {/* Section Header - CNN Style */}
          <div className="mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-black"></div>
            <h1 className="text-xs font-[800] uppercase tracking-[0.1em] text-black">
              {categoryName}
            </h1>
          </div>

          {/* Main Story + List Layout - CNN Style */}
          {categoryNews.length > 0 && (
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
                {/* Ad Slot */}
                <AdSlot slot="SIDEBAR" />

                {/* Related Categories */}
                <RelatedCategories
                  currentCategoryId={category.id}
                  currentCategoryParentId={category.parentId}
                />
              </div>
            </div>
          )}

          {/* Inline Ad After Main Section */}
          {categoryNews.length > 0 && <InlineAdPlacement index={0} />}

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

          {/* Empty State */}
          {categoryNews.length === 0 && (
            <div className="text-center py-12 border-t border-[#E6E6E6]">
              <p className="text-[#4D4D4D] text-lg mb-4">{t("news.noNews")}</p>
              <p className="text-[#666666]">
                {language === "it"
                  ? "Torna più tardi per nuovi articoli in questa categoria."
                  : "Check back later for new articles in this category."}
              </p>
            </div>
          )}

          {/* Pagination - CNN Style */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2 border-t border-[#E6E6E6] pt-6">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const newPage = Math.max(1, page - 1);
                  setPage(newPage);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={page === 1}
                className="px-4 py-2 border border-[#E6E6E6] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAFAFA] transition-colors"
                type="button"
              >
                {t("common.previous")}
              </button>
              <span className="px-4 py-2 text-sm text-[#666666]">
                {language === "it" ? "Pagina" : "Page"} {page}{" "}
                {language === "it" ? "di" : "of"} {meta.totalPages || 1}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const newPage = Math.min(meta.totalPages || 1, page + 1);
                  setPage(newPage);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={page === (meta.totalPages || 1)}
                className="px-4 py-2 border border-[#E6E6E6] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAFAFA] transition-colors"
                type="button"
              >
                {t("common.next")}
              </button>
            </div>
          )}
        </div>
      </div>
    </InlineAdProvider>
  );
}
