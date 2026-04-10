"use client";

import { useState, useEffect, useMemo, useRef, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
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
import { getCategoryPath } from "@/lib/helpers/category-helpers";
import { Category } from "@/types/category.types";
import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { isYouTubeUrl, getYouTubeThumbnail } from "@/lib/helpers/youtube";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import { AdSlot, CnnLabeledAdStrip } from "@/components/ads/ad-slot";
import { InlineAdProvider, InlineAdPlacement } from "@/components/ads/inline-ad-block";
import { useNavCategoryLinks } from "@/lib/hooks/useNavCategoryLinks";
import { categorySectionBaseFromPathname } from "@/lib/helpers/category-routes";

function getNewsUrl(news: News): string {
  if (news.slug) {
    return `/news/${news.slug}`;
  }
  return `/news/${news.id}`;
}

function formatVideoDuration(duration?: string | number): string {
  if (!duration) return "0:00";
  if (typeof duration === "number") {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
  return duration;
}

function storyTimestamp(story: News): string {
  return formatRelativeTime(story.publishedAt || story.createdAt);
}

function storyCategoryLabel(story: News, language: string): string | null {
  const c = story.category;
  if (!c) return null;
  if (language === "it") {
    return c.nameIt?.trim() || c.nameEn || null;
  }
  return c.nameEn?.trim() || c.nameIt || null;
}

function storyHasListThumb(story: News): boolean {
  if (story.youtubeUrl && isYouTubeUrl(story.youtubeUrl)) return true;
  if (story.mainImage?.trim()) return true;
  return false;
}

function CategoryRibbon({ stories }: { stories: News[] }) {
  const scrollRef = useRef<HTMLUListElement>(null);

  const scrollByDir = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.min(420, Math.floor(el.clientWidth * 0.85));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (!stories.length) return null;

  return (
    <div className="product-zone product-zone--t-light product-zone-1-observer">
      <div className="product-zone__inner has-pseudo-class-fix-layout--full-width">
        <div className="product-zone__items layout--full-width">
          <div className="container_ribbon">
            <div className="container_ribbon__cards-wrapper">
              <button
                type="button"
                className="container_ribbon__carousel-button-prev"
                aria-label="Previous stories"
                onClick={() => scrollByDir(-1)}
              >
                ‹
              </button>
              <div className="container_ribbon__field-wrapper">
                <ul ref={scrollRef} className="container_ribbon__field-links" role="list">
                  {stories.map((story) => (
                    <li key={story.id} className="container_ribbon__item">
                      <Link href={getNewsUrl(story)} className="container_ribbon__link">
                        <div className="container_ribbon__text">
                          <p className="container_ribbon__headline">
                            <span className="container_ribbon__headline-text">{story.title}</span>
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                className="container_ribbon__carousel-button-next"
                aria-label="Next stories"
                onClick={() => scrollByDir(1)}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CategoryClientProps {
  category: Category | null;
  initialNews: News[];
  structuredData?: StructuredDataType | null;
}

export function CategoryClient({
  category,
  initialNews,
  structuredData: initialStructuredData,
}: CategoryClientProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const categoryBase = categorySectionBaseFromPathname(pathname);
  const { language, t } = useLanguage();
  const pageParam = searchParams?.get("page");
  const [page, setPage] = useState(() => {
    return pageParam ? Number(pageParam) || 1 : 1;
  });
  const [structuredData, setStructuredData] = useState<StructuredDataType | null>(
    initialStructuredData || null
  );

  useEffect(() => {
    const currentPageParam = searchParams?.get("page");
    if (currentPageParam) {
      const newPage = Number(currentPageParam) || 1;
      if (newPage !== page) {
        requestAnimationFrame(() => {
          setPage(newPage);
        });
      }
    }
  }, [searchParams, page]);

  const { data: categoriesData } = useCategories();
  const allCategories = useMemo(() => categoriesData?.data?.data || [], [categoriesData]);

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

  const { allItems: navCategoryLinks } = useNavCategoryLinks();

  const {
    data: newsData,
    isLoading: newsLoading,
    error: newsError,
  } = useNews({
    categoryId: category?.id,
    status: "PUBLISHED",
    page,
    limit: 20,
    enabled: Boolean(category?.id),
  });

  const categoryNews = newsData?.data?.data?.news || initialNews || [];
  const categoryName = category ? (language === "it" ? category.nameIt : category.nameEn) : null;
  const meta = newsData?.data?.data?.meta;

  const mainStory = categoryNews[0];
  const listArticles = categoryNews.slice(1, 6);
  const gridArticles = categoryNews.slice(6);
  const ribbonStories = categoryNews.slice(0, 14);

  const zoneShell = (body: ReactNode) => (
    <section className="layout__wrapper layout-homepage__wrapper min-h-screen bg-white">
      <div className="layout__main layout-homepage__main">{body}</div>
    </section>
  );

  if (!category) {
    return zoneShell(
      <div className="zone zone--t-light zone-2-observer">
        <div className="zone__inner has-pseudo-class-fix-layout--wide-center px-4 sm:px-6">
          <div className="zone__items layout--wide-center py-8 text-center max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-black">Category Not Found</h1>
            <p className="text-[#4D4D4D] mb-4">
              The category you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <p className="text-sm text-[#4D4D4D] mb-6 leading-relaxed">
              {language === "it"
                ? "Nessuna categoria con questo slug è registrata nell’API. In Admin → Categorie crea la categoria (es. slug «science») oppure usa uno degli slug qui sotto."
                : "No category with this slug exists in your database. Create it in Admin → Categories (e.g. slug “science”) or open a section below."}
            </p>
            {navCategoryLinks.length > 0 && (
              <div className="mb-8">
                <p className="cnn-hp-section-heading border-l-4 border-[#cc0000] pl-3 mb-3 text-left">
                  {language === "it" ? "Sezioni disponibili" : "Available sections"}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {navCategoryLinks.map((c) => (
                    <Link
                      key={c.id}
                      href={c.href}
                      className="px-4 py-2 border border-[#E6E6E6] rounded text-sm font-semibold text-[#0A0A0A] hover:border-[#CC0000] hover:text-[#CC0000] transition-colors"
                    >
                      {language === "it" ? c.nameIt : c.nameEn}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#CC0000] text-white hover:bg-[#B30000] transition"
            >
              {t("nav.home")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (newsLoading && page === 1 && initialNews.length === 0) {
    return zoneShell(
      <div className="zone zone--t-light zone-2-observer">
        <div className="zone__inner has-pseudo-class-fix-layout--wide-center">
          <div className="zone__items layout--wide-center py-6">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (newsError && page === 1 && initialNews.length === 0) {
    return zoneShell(
      <div className="zone zone--t-light zone-2-observer">
        <div className="zone__inner has-pseudo-class-fix-layout--wide-center">
          <div className="zone__items layout--wide-center py-6">
            <ErrorMessage error={newsError} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <InlineAdProvider>
      {structuredData && <StructuredData data={structuredData} id="category-structured-data" />}
      <section className="layout__wrapper layout-homepage__wrapper min-h-screen bg-white">
        <div className="layout__main layout-homepage__main">
          {categoryNews.length > 0 && <CategoryRibbon stories={ribbonStories} />}

          <div className="zone zone--t-light zone-2-observer">
            <div className="zone__inner has-pseudo-class-fix-layout--wide-center">
              <div className="zone__items layout--wide-center">
                <div className="stack">
                  <div className="stack__inner">
                    <div className="stack__items">
                      <nav
                        className="pt-6 pb-2 text-xs text-[#666666]"
                        aria-label={language === "it" ? "Percorso categoria" : "Breadcrumb"}
                      >
                        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 list-none m-0 p-0">
                          <li>
                            <Link href="/" className="hover:text-[#CC0000] transition-colors">
                              {t("nav.home")}
                            </Link>
                          </li>
                          {categoryPath.map((c, i) => {
                            const isLast = i === categoryPath.length - 1;
                            const name = language === "it" ? c.nameIt : c.nameEn;
                            return (
                              <li key={c.id} className="flex items-center gap-1">
                                <span aria-hidden className="text-[#CCCCCC]">
                                  /
                                </span>
                                {isLast ? (
                                  <span className="text-[#0A0A0A] font-semibold">{name}</span>
                                ) : (
                                  <Link
                                    href={`${categoryBase}/${c.slug}`}
                                    className="hover:text-[#CC0000] transition-colors"
                                  >
                                    {name}
                                  </Link>
                                )}
                              </li>
                            );
                          })}
                        </ol>
                      </nav>

                      <h1 className="text-[1.75rem] sm:text-[2rem] font-bold leading-tight text-black border-l-4 border-[#cc0000] pl-3 mb-6">
                        {categoryName}
                      </h1>

                      <CnnLabeledAdStrip slot="BETWEEN_SECTIONS" />

                      {categoryNews.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-6">
                          {/* Left rail — same lead-plus pattern as homepage */}
                          <div className="lg:col-span-3">
                            <h2 className="cnn-hp-section-heading border-l-4 border-[#cc0000] pl-3 mb-4">
                              {language === "it" ? "Altre notizie" : "More coverage"}
                            </h2>
                            <div className="container_lead-plus-headlines container_lead-plus-headlines--text-list">
                              <div className="container_lead-plus-headlines__cards-wrapper">
                                <div className="container_lead-plus-headlines__field-wrapper">
                                  <ul className="container_lead-plus-headlines__field-links container_lead-plus-headlines__field-links--text-list">
                                    {listArticles.map((story: News) => {
                                      const hasThumb = storyHasListThumb(story);
                                      return (
                                        <li
                                          key={story.id}
                                          className={
                                            hasThumb
                                              ? "container_lead-plus-headlines__item container_lead-plus-headlines__item--more-with-image"
                                              : "container_lead-plus-headlines__item container_lead-plus-headlines__item--text-only"
                                          }
                                        >
                                          <Link
                                            href={getNewsUrl(story)}
                                            className={
                                              hasThumb
                                                ? "container_lead-plus-headlines__link container_lead-plus-headlines__link--more-row group"
                                                : "container_lead-plus-headlines__link group"
                                            }
                                          >
                                            {hasThumb && (
                                              <div className="container_lead-plus-headlines__item-media-wrapper container_lead-plus-headlines__item-media-wrapper--thumb card--media-card-label-show">
                                                <div className="container_lead-plus-headlines__item-media card--media-thumb relative w-full">
                                                  {story.youtubeUrl && isYouTubeUrl(story.youtubeUrl) ? (
                                                    <OptimizedImage
                                                      src={getYouTubeThumbnail(story.youtubeUrl, "high") || ""}
                                                      alt={story.title}
                                                      fill
                                                      className="object-cover"
                                                      quality={78}
                                                      loading="lazy"
                                                      sizes="132px"
                                                    />
                                                  ) : story.mainImage?.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                                                    <video
                                                      src={getImageUrl(story.mainImage)}
                                                      className="absolute inset-0 w-full h-full object-cover"
                                                      muted
                                                      playsInline
                                                      preload="metadata"
                                                    />
                                                  ) : (
                                                    <OptimizedImage
                                                      src={getImageUrl(story.mainImage!)}
                                                      alt={story.title}
                                                      fill
                                                      className="object-cover"
                                                      quality={78}
                                                      loading="lazy"
                                                      sizes="132px"
                                                    />
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                            <div
                                              className={
                                                hasThumb
                                                  ? "container_lead-plus-headlines__text container_lead-plus-headlines__text--more-row"
                                                  : "container_lead-plus-headlines__text"
                                              }
                                            >
                                              <h3 className="container_lead-plus-headlines__headline container_lead-plus-headlines__headline--rail group-hover:text-[#cc0000] transition-colors">
                                                <span className="container_lead-plus-headlines__headline-text line-clamp-3">
                                                  {story.title}
                                                </span>
                                              </h3>
                                              <span className="cnn-hp-meta inline-block mt-0.5">
                                                {storyTimestamp(story)}
                                              </span>
                                            </div>
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Center — hero lead */}
                          <div className="lg:col-span-6">
                            {mainStory && (
                              <div className="container_lead-plus-headlines mb-8">
                                <Link
                                  href={getNewsUrl(mainStory)}
                                  className="container_lead-plus-headlines__link block group"
                                >
                                  <div className="container_lead-plus-headlines__item-media-wrapper card--media-card-label-show">
                                    <div className="container_lead-plus-headlines__item-media card--media-extra-large relative w-full">
                                      {mainStory.youtubeUrl && isYouTubeUrl(mainStory.youtubeUrl) ? (
                                        <div className="relative w-full h-full min-h-[240px]">
                                          <OptimizedImage
                                            src={getYouTubeThumbnail(mainStory.youtubeUrl, "maxres") || ""}
                                            alt={mainStory.title}
                                            fill
                                            className="object-cover"
                                            priority
                                            quality={90}
                                            sizes="(max-width: 768px) 100vw, 720px"
                                          />
                                          <div className="absolute bottom-3 left-3 bg-black/80 text-white px-2 py-1 text-xs font-semibold">
                                            {formatVideoDuration()}
                                          </div>
                                        </div>
                                      ) : mainStory.mainImage && mainStory.mainImage.trim() !== "" ? (
                                        mainStory.mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                                          <div className="relative w-full h-full min-h-[240px]">
                                            <video
                                              src={getImageUrl(mainStory.mainImage)}
                                              className="absolute inset-0 w-full h-full object-cover"
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
                                            sizes="(max-width: 768px) 100vw, 720px"
                                          />
                                        )
                                      ) : (
                                        <div className="absolute inset-0 bg-[#e8e8e8]" />
                                      )}
                                    </div>
                                    {mainStory.category && storyCategoryLabel(mainStory, language) && (
                                      <div className="card__label-slot card__label-slot--above-media">
                                        <div className="card__label-container">
                                          <span className="card__label card__label--type-analysis">
                                            <span className="card__label-bull-span">
                                              <span className="card__label-indicator">•</span>
                                              {storyCategoryLabel(mainStory, language)}
                                            </span>
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="container_lead-plus-headlines__text mt-4">
                                    <h2 className="container_lead-plus-headlines__headline container_lead-plus-headlines__headline--main group-hover:text-[#cc0000] transition-colors">
                                      <span className="container_lead-plus-headlines__headline-text">
                                        {mainStory.title}
                                      </span>
                                    </h2>
                                    {mainStory.summary && (
                                      <p className="cnn-hp-summary line-clamp-3">{mainStory.summary}</p>
                                    )}
                                    <p className="cnn-hp-meta mt-2">{storyTimestamp(mainStory)}</p>
                                  </div>
                                </Link>
                              </div>
                            )}
                          </div>

                          {/* Right rail */}
                          <div className="lg:col-span-3 space-y-8">
                            <div>
                              <h2 className="cnn-hp-section-heading border-l-4 border-black pl-3 mb-3">
                                {language === "it" ? "Pubblicità" : "Advertisement"}
                              </h2>
                              <AdSlot slot="SIDEBAR" />
                            </div>
                            <RelatedCategories
                              currentCategoryId={category.id}
                              currentCategoryParentId={category.parentId}
                              variant="cnnRail"
                            />
                          </div>
                        </div>
                      )}

                      {categoryNews.length > 0 && <InlineAdPlacement index={0} />}

                      {categoryNews.length > 0 && gridArticles.length > 0 && (
                        <CnnLabeledAdStrip slot="BETWEEN_SECTIONS_1" />
                      )}

                      {gridArticles.length > 0 && (
                        <>
                          <h2 className="cnn-hp-section-heading border-l-4 border-[#cc0000] pl-3 mb-4">
                            {language === "it" ? "Altre storie" : "More stories"}
                          </h2>
                          <div className="container_lead-package mb-8">
                            <div className="container_lead-package__cards-wrapper">
                              <div className="container_lead-package__field-wrapper">
                                <ul className="container_lead-package__field-links">
                                  {gridArticles.map((story: News) => (
                                    <li key={story.id} className="container_lead-package__item">
                                      <Link href={getNewsUrl(story)} className="container_lead-package__link group">
                                        <div className="container_lead-package__item-media-wrapper">
                                          <div className="container_lead-package__item-media relative aspect-video w-full">
                                            {story.youtubeUrl && isYouTubeUrl(story.youtubeUrl) ? (
                                              <>
                                                <OptimizedImage
                                                  src={getYouTubeThumbnail(story.youtubeUrl, "high") || ""}
                                                  alt={story.title}
                                                  fill
                                                  className="object-cover"
                                                  quality={78}
                                                  loading="lazy"
                                                  sizes="(max-width: 768px) 100vw, 360px"
                                                />
                                                <div className="absolute bottom-2 left-2 bg-black/80 text-white px-1.5 py-0.5 text-[10px] font-semibold z-[1]">
                                                  {formatVideoDuration()}
                                                </div>
                                              </>
                                            ) : story.mainImage && story.mainImage.trim() !== "" ? (
                                              story.mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                                                <>
                                                  <video
                                                    src={getImageUrl(story.mainImage)}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    muted
                                                    playsInline
                                                    preload="metadata"
                                                  />
                                                  <div className="absolute bottom-2 left-2 bg-black/80 text-white px-1.5 py-0.5 text-[10px] font-semibold z-[1]">
                                                    {formatVideoDuration()}
                                                  </div>
                                                </>
                                              ) : (
                                                <OptimizedImage
                                                  src={getImageUrl(story.mainImage)}
                                                  alt={story.title}
                                                  fill
                                                  className="object-cover"
                                                  quality={78}
                                                  loading="lazy"
                                                  sizes="(max-width: 768px) 100vw, 360px"
                                                />
                                              )
                                            ) : (
                                              <div className="absolute inset-0 bg-[#e8e8e8]" />
                                            )}
                                          </div>
                                        </div>
                                        <div className="container_lead-package__text">
                                          <h3 className="container_lead-package__headline">{story.title}</h3>
                                          {story.summary && (
                                            <p className="cnn-hp-summary line-clamp-2 text-sm mt-1">{story.summary}</p>
                                          )}
                                          <div className="flex flex-wrap items-center gap-2 mt-2 cnn-hp-meta">
                                            {storyCategoryLabel(story, language) && (
                                              <>
                                                <span className="text-[#cc0000] font-[600] uppercase tracking-wide">
                                                  {storyCategoryLabel(story, language)}
                                                </span>
                                                <span className="text-[#999999]">•</span>
                                              </>
                                            )}
                                            <span>{storyTimestamp(story)}</span>
                                          </div>
                                        </div>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

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

                      {categoryNews.length > 0 && (
                        <>
                          <InlineAdPlacement index={1} />
                          <CnnLabeledAdStrip slot="MID_PAGE" />
                        </>
                      )}

                      {meta && meta.totalPages > 1 && (
                        <div className="mt-8 flex justify-center items-center gap-2 border-t border-[#E6E6E6] pt-6 pb-8">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const newPage = Math.max(1, page - 1);
                              setPage(newPage);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            disabled={page === 1}
                            className="px-4 py-2 border border-[#E6E6E6] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAFAFA] transition-colors text-sm font-semibold"
                            type="button"
                          >
                            {t("common.previous")}
                          </button>
                          <span className="px-4 py-2 text-sm text-[#666666] cnn-hp-meta">
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
                            className="px-4 py-2 border border-[#E6E6E6] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAFAFA] transition-colors text-sm font-semibold"
                            type="button"
                          >
                            {t("common.next")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </InlineAdProvider>
  );
}
