"use client";

import { useMemo, useRef } from "react";
import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { isYouTubeUrl, getYouTubeThumbnail } from "@/lib/helpers/youtube";
import { formatRelativeTime, formatDate } from "@/lib/helpers/formatDate";
import Link from "next/link";
import { CnnLabeledAdStrip } from "@/components/ads/ad-slot";
import { InlineAdProvider, InlineAdPlacement } from "@/components/ads/inline-ad-block";
import { useLanguage } from "@/providers/LanguageProvider";
import type { Language } from "@/lib/i18n/translations";
import { homepageStoryLinkZjs } from "@/lib/analytics/homepage-zjs";
import { categorySectionHref } from "@/lib/helpers/category-routes";

interface CNNHomepageLayoutProps {
  heroStory: News | null;
  featuredStories: News[];
  latestStories: News[];
  categoryStories: Record<string, { category: NonNullable<News["category"]>; news: News[] }>;
  videoStories: News[];
  worldStories: News[];
}

function newsHref(story: News) {
  return `/news/${story.slug || story.id}`;
}

function isStoryVideo(story: News): boolean {
  if (story.youtubeUrl?.trim()) return true;
  const m = story.mainImage?.trim();
  if (!m) return false;
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(m);
}

function CnnVideoPlayOverlay({ size = "md" }: { size?: "md" | "sm" }) {
  return (
    <div
      className={
        size === "sm"
          ? "cnn-hp-video-play-overlay cnn-hp-video-play-overlay--sm"
          : "cnn-hp-video-play-overlay"
      }
      aria-hidden
    >
      <span className="cnn-hp-video-play-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
          <path fill="currentColor" d="M8 5v14l11-7z" />
        </svg>
      </span>
    </div>
  );
}

function CnnVideoTextLabel({ compact }: { compact?: boolean }) {
  return (
    <span
      className={
        compact
          ? "cnn-hp-video-text-label cnn-hp-video-text-label--compact"
          : "cnn-hp-video-text-label"
      }
    >
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M8 5v14l11-7z" />
      </svg>
      Video
    </span>
  );
}

function categoryTitle(
  category: NonNullable<News["category"]>,
  language: Language
) {
  if (language === "it") {
    return category.nameIt?.trim() || category.nameEn || "";
  }
  return category.nameEn?.trim() || category.nameIt || "";
}

function RibbonCarousel({ stories }: { stories: News[] }) {
  const scrollRef = useRef<HTMLUListElement>(null);

  const scrollByDir = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.min(420, Math.floor(el.clientWidth * 0.85));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (!stories.length) return null;

  return (
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
          <ul
            ref={scrollRef}
            className="container_ribbon__field-links"
            role="list"
          >
            {stories.map((story) => (
              <li key={story.id} className="container_ribbon__item">
                <Link
                  href={newsHref(story)}
                  className="container_ribbon__link"
                  {...homepageStoryLinkZjs(story.title, newsHref(story), "ribbon")}
                >
                  <div className="container_ribbon__text">
                    <p className="container_ribbon__headline">
                      {isStoryVideo(story) && (
                        <span className="cnn-hp-ribbon-video-badge" aria-hidden>
                          <svg width="14" height="14" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      )}
                      <span className="container_ribbon__headline-text">
                        {story.title}
                      </span>
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
  );
}

function MediaImage({
  story,
  alt,
  priority,
  sizes,
  className = "",
}: {
  story: News;
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const main = story.mainImage?.trim();
  if (main) {
    if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(main)) {
      return (
        <video
          src={getImageUrl(main)}
          className={`absolute inset-0 h-full w-full object-cover ${className}`}
          muted
          playsInline
          preload="metadata"
          aria-hidden
        />
      );
    }
    return (
      <OptimizedImage
        src={getImageUrl(main)}
        alt={alt}
        fill
        className={`object-cover ${className}`}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        quality={priority ? 90 : 78}
        sizes={sizes}
      />
    );
  }
  if (story.youtubeUrl && isYouTubeUrl(story.youtubeUrl)) {
    const thumb = getYouTubeThumbnail(story.youtubeUrl, "high");
    if (thumb) {
      return (
        <OptimizedImage
          src={thumb}
          alt={alt}
          fill
          className={`object-cover ${className}`}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          quality={priority ? 90 : 78}
          sizes={sizes}
        />
      );
    }
  }
  return <div className={`absolute inset-0 bg-[#e8e8e8] ${className}`} />;
}

function railStoryHasThumb(story: News): boolean {
  if (story.youtubeUrl && isYouTubeUrl(story.youtubeUrl)) return true;
  return Boolean(story.mainImage?.trim());
}

function TrendingRailThumb({ story }: { story: News }) {
  if (!railStoryHasThumb(story)) return null;
  return (
    <div className="cnn-hp-rail-thumb" aria-hidden>
      {story.youtubeUrl && isYouTubeUrl(story.youtubeUrl) ? (
        <OptimizedImage
          src={getYouTubeThumbnail(story.youtubeUrl, "high") || ""}
          alt=""
          fill
          className="object-cover"
          sizes="88px"
          loading="lazy"
          quality={72}
        />
      ) : story.mainImage?.match(/\.(mp4|webm|ogg|mov)$/i) ? (
        <video
          src={getImageUrl(story.mainImage)}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
          aria-hidden
        />
      ) : (
        <OptimizedImage
          src={getImageUrl(story.mainImage!)}
          alt=""
          fill
          className="object-cover"
          sizes="88px"
          loading="lazy"
          quality={72}
        />
      )}
    </div>
  );
}

export function CNNHomepageLayout({
  heroStory,
  featuredStories,
  latestStories,
  categoryStories,
  videoStories,
  worldStories,
}: CNNHomepageLayoutProps) {
  const { language } = useLanguage();

  const {
    ribbonStories,
    leftStories,
    centerGridStories,
    moreTopStories,
    categoryColumns,
    trendingStories,
    latestSidebar,
  } = useMemo(() => {
    const heroId = heroStory?.id;
    const pool = featuredStories.filter(
      (n) => n && (!heroId || n.id !== heroId)
    );

    const ribbonStories = pool.slice(0, 14);
    const leftStories = pool.slice(0, 6);
    const centerGridStories = pool.slice(6, 10);
    const moreTopStories = pool.slice(10, 18);

    const used = new Set<string>();
    if (heroId) used.add(heroId);
    leftStories.forEach((s) => used.add(s.id));
    centerGridStories.forEach((s) => used.add(s.id));

    const trendingStories = latestStories
      .filter((n) => n && !used.has(n.id))
      .slice(0, 5);
    trendingStories.forEach((s) => used.add(s.id));

    const latestSidebar = worldStories
      .filter((n) => n && !used.has(n.id))
      .slice(0, 5);

    const rawCats = Object.values(categoryStories);
    let categoryColumns = rawCats
      .filter((c) => c.news?.length)
      .slice(0, 6);

    if (categoryColumns.length === 0 && pool.length >= 3) {
      const chunk = (arr: News[], size: number, start: number) =>
        arr.slice(start, start + size);
      const placeholderCategory = (
        id: string,
        nameEn: string,
        nameIt: string,
        slug: string
      ): NonNullable<News["category"]> => ({
        id,
        nameEn,
        nameIt,
        slug,
        order: 0,
        createdAt: "",
        updatedAt: "",
      });
      categoryColumns = [
        {
          category: placeholderCategory(
            "fallback-more-top",
            "More top stories",
            "Altre notizie",
            "more-top"
          ),
          news: chunk(pool, 3, 18),
        },
        {
          category: placeholderCategory(
            "fallback-latest",
            "Latest picks",
            "Scelti per te",
            "latest-picks"
          ),
          news: chunk(pool, 3, 21),
        },
      ];
    }

    return {
      ribbonStories,
      leftStories,
      centerGridStories,
      moreTopStories,
      categoryColumns,
      trendingStories,
      latestSidebar,
    };
  }, [
    heroStory,
    featuredStories,
    latestStories,
    worldStories,
    categoryStories,
  ]);

  const videoShelf = videoStories.slice(0, 8);

  return (
    <InlineAdProvider>
      <section
        className="layout__wrapper layout-homepage__wrapper min-h-screen bg-white"
        data-editable="homepage"
      >
        <div className="layout__main layout-homepage__main">
          <div className="scope cnn-hp-scope">
          {/* Ribbon — top headlines strip */}
          <div
            className="product-zone product-zone--t-light product-zone-1-observer"
            data-track-zone="homepage_ribbon"
            data-uri="cms.local/_components/product-zone/instances/homepage-ribbon@published"
          >
            <div className="product-zone__inner has-pseudo-class-fix-layout--full-width">
              <div className="product-zone__items layout--full-width">
                <RibbonCarousel stories={ribbonStories} />
              </div>
            </div>
          </div>

          <CnnLabeledAdStrip slot="BETWEEN_SECTIONS" />

          <div
            className="zone zone--t-light zone-2-observer"
            data-track-zone="homepage_lead_stack"
            data-uri="cms.local/_components/zone/instances/homepage-lead@published"
          >
          <div className="zone__inner has-pseudo-class-fix-layout--wide-center">
            <div className="zone__items layout--wide-center">
              <div className="stack">
                <div className="stack__inner">
                  <div className="stack__items">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 py-6">
                      {/* Left — lead + headlines */}
                      <div className="lg:col-span-3">
                        <h2 className="cnn-hp-section-heading border-l-4 border-[#cc0000] pl-3 mb-4">
                          Top stories
                        </h2>
                        <div className="container_lead-plus-headlines">
                          <div className="container_lead-plus-headlines__cards-wrapper">
                            <div className="container_lead-plus-headlines__field-wrapper">
                              <ul className="container_lead-plus-headlines__field-links">
                                {leftStories.map((story) => (
                                  <li
                                    key={story.id}
                                    className="container_lead-plus-headlines__item"
                                  >
                                    <Link
                                      href={newsHref(story)}
                                      className="container_lead-plus-headlines__link group"
                                      {...homepageStoryLinkZjs(
                                        story.title,
                                        newsHref(story),
                                        "top-stories"
                                      )}
                                    >
                                      <div className="container_lead-plus-headlines__item-media-wrapper card--media-card-label-show">
                                        <div className="container_lead-plus-headlines__item-media card--media-large relative w-full">
                                          <MediaImage
                                            story={story}
                                            alt={story.title}
                                            sizes="320px"
                                          />
                                          {isStoryVideo(story) && (
                                            <CnnVideoPlayOverlay />
                                          )}
                                        </div>
                                      </div>
                                      <div className="container_lead-plus-headlines__text">
                                        <h3
                                          className={`container_lead-plus-headlines__headline container_lead-plus-headlines__headline--rail${story.isBreaking ? " container_lead-plus-headlines__headline--breaking" : ""}`}
                                        >
                                          <span className="container_lead-plus-headlines__headline-text">
                                            {story.title}
                                          </span>
                                        </h3>
                                        {story.publishedAt && (
                                          <span className="cnn-hp-meta inline-block mt-1">
                                            {formatRelativeTime(story.publishedAt)}
                                          </span>
                                        )}
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {moreTopStories.length > 0 && (
                          <div className="mt-8">
                            <h2 className="cnn-hp-section-heading border-l-4 border-[#cc0000] pl-3 mb-3">
                              More top stories
                            </h2>
                            <div className="container_lead-plus-headlines container_lead-plus-headlines--text-list">
                              <div className="container_lead-plus-headlines__cards-wrapper">
                                <div className="container_lead-plus-headlines__field-wrapper">
                                  <ul className="container_lead-plus-headlines__field-links container_lead-plus-headlines__field-links--text-list">
                                    {moreTopStories.map((story) => {
                                      const hasThumb = Boolean(
                                        story.mainImage?.trim()
                                      );
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
                                            href={newsHref(story)}
                                            className={
                                              hasThumb
                                                ? "container_lead-plus-headlines__link container_lead-plus-headlines__link--more-row group"
                                                : "container_lead-plus-headlines__link group"
                                            }
                                            {...homepageStoryLinkZjs(
                                              story.title,
                                              newsHref(story),
                                              "more-top"
                                            )}
                                          >
                                            {hasThumb && (
                                              <div className="container_lead-plus-headlines__item-media-wrapper container_lead-plus-headlines__item-media-wrapper--thumb card--media-card-label-show">
                                                <div className="container_lead-plus-headlines__item-media card--media-thumb relative w-full">
                                                  <MediaImage
                                                    story={story}
                                                    alt={story.title}
                                                    sizes="132px"
                                                  />
                                                  {isStoryVideo(story) && (
                                                    <CnnVideoPlayOverlay size="sm" />
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
                                              {isStoryVideo(story) && !hasThumb && (
                                                <CnnVideoTextLabel compact />
                                              )}
                                              <h3
                                                className={`container_lead-plus-headlines__headline container_lead-plus-headlines__headline--rail${story.isBreaking ? " container_lead-plus-headlines__headline--breaking" : ""}`}
                                              >
                                                <span className="container_lead-plus-headlines__headline-text line-clamp-3">
                                                  {story.title}
                                                </span>
                                              </h3>
                                              {story.publishedAt && (
                                                <span className="cnn-hp-meta inline-block">
                                                  {formatRelativeTime(
                                                    story.publishedAt
                                                  )}
                                                </span>
                                              )}
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
                        )}
                      </div>

                      {/* Center — hero + 2x2 lead package */}
                      <div className="lg:col-span-6">
                        {heroStory && (
                          <div className="container_lead-plus-headlines mb-8">
                            <Link
                              href={newsHref(heroStory)}
                              className="container_lead-plus-headlines__link block"
                              {...homepageStoryLinkZjs(
                                heroStory.title,
                                newsHref(heroStory),
                                "hero"
                              )}
                            >
                              <div className="container_lead-plus-headlines__item-media-wrapper card--media-card-label-show">
                                <div className="container_lead-plus-headlines__item-media card--media-extra-large relative w-full">
                                  <MediaImage
                                    story={heroStory}
                                    alt={heroStory.title}
                                    priority
                                    sizes="(max-width: 768px) 100vw, 720px"
                                  />
                                  {isStoryVideo(heroStory) && (
                                    <CnnVideoPlayOverlay />
                                  )}
                                </div>
                                {heroStory.category && (
                                  <div className="card__label-slot card__label-slot--above-media">
                                    <div className="card__label-container">
                                      <span className="card__label card__label--type-analysis">
                                        <span className="card__label-bull-span">
                                          <span className="card__label-indicator">
                                            •
                                          </span>
                                          {categoryTitle(
                                            heroStory.category,
                                            language
                                          )}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="container_lead-plus-headlines__text mt-4">
                                <h1
                                  className={`container_lead-plus-headlines__headline container_lead-plus-headlines__headline--main${heroStory.isBreaking ? " container_lead-plus-headlines__headline--breaking" : ""}`}
                                >
                                  <span className="container_lead-plus-headlines__headline-text">
                                    {heroStory.title}
                                  </span>
                                </h1>
                                {heroStory.summary && (
                                  <p className="cnn-hp-summary line-clamp-3">
                                    {heroStory.summary}
                                  </p>
                                )}
                                {heroStory.publishedAt && (
                                  <p className="cnn-hp-meta mt-2">
                                    {formatDate(heroStory.publishedAt)}
                                  </p>
                                )}
                              </div>
                            </Link>
                          </div>
                        )}

                        {centerGridStories.length > 0 && (
                          <div className="container_lead-package">
                            <div className="container_lead-package__cards-wrapper">
                              <div className="container_lead-package__field-wrapper">
                                <ul className="container_lead-package__field-links">
                                  {centerGridStories.map((story) => (
                                    <li
                                      key={story.id}
                                      className="container_lead-package__item"
                                    >
                                      <Link
                                        href={newsHref(story)}
                                        className="container_lead-package__link"
                                        {...homepageStoryLinkZjs(
                                          story.title,
                                          newsHref(story),
                                          "lead-package"
                                        )}
                                      >
                                        <div className="container_lead-package__item-media-wrapper">
                                          <div className="container_lead-package__item-media relative aspect-video w-full">
                                            <MediaImage
                                              story={story}
                                              alt={story.title}
                                              sizes="(max-width: 768px) 100vw, 360px"
                                            />
                                            {isStoryVideo(story) && (
                                              <CnnVideoPlayOverlay />
                                            )}
                                          </div>
                                        </div>
                                        <div className="container_lead-package__text">
                                          <h3
                                            className={`container_lead-package__headline${story.isBreaking ? " container_lead-package__headline--breaking" : ""}`}
                                          >
                                            {story.title}
                                          </h3>
                                          {story.publishedAt && (
                                            <p className="cnn-hp-meta mt-1">
                                              {formatRelativeTime(
                                                story.publishedAt
                                              )}
                                            </p>
                                          )}
                                        </div>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right — trending, latest, video */}
                      <div className="lg:col-span-3 space-y-8">
                        <div>
                          <h2 className="cnn-hp-section-heading border-l-4 border-[#cc0000] pl-3 mb-3">
                            Trending
                          </h2>
                          <ul className="cnn-hp-rail-list">
                            {trendingStories.map((story) => {
                              const hasThumb = railStoryHasThumb(story);
                              const dateSrc = story.publishedAt || story.createdAt;
                              return (
                                <li key={story.id}>
                                  <Link
                                    href={newsHref(story)}
                                    className={`cnn-hp-rail-link${hasThumb ? " cnn-hp-rail-link--with-thumb" : ""}`}
                                    {...homepageStoryLinkZjs(
                                      story.title,
                                      newsHref(story),
                                      "trending"
                                    )}
                                  >
                                    {hasThumb && <TrendingRailThumb story={story} />}
                                    <span
                                      className={`cnn-hp-rail-dot${hasThumb ? " cnn-hp-rail-dot--align-text" : ""}`}
                                      aria-hidden
                                    />
                                    <div className="cnn-hp-rail-text">
                                      <span
                                        className={`cnn-hp-rail-headline line-clamp-3${story.isBreaking ? " cnn-hp-rail-headline--breaking" : ""}`}
                                      >
                                        {story.title}
                                      </span>
                                      {dateSrc && (
                                        <span className="cnn-hp-rail-date">
                                          {formatDate(dateSrc, "MMM dd", language)}
                                        </span>
                                      )}
                                    </div>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        <div>
                          <h2 className="cnn-hp-section-heading border-l-4 border-[#cc0000] pl-3 mb-3">
                            Latest
                          </h2>
                          <ul className="cnn-hp-rail-list">
                            {latestSidebar.map((story) => {
                              const hasThumb = railStoryHasThumb(story);
                              const dateSrc = story.publishedAt || story.createdAt;
                              return (
                                <li key={story.id}>
                                  <Link
                                    href={newsHref(story)}
                                    className={`cnn-hp-rail-link cnn-hp-rail-link--latest${hasThumb ? " cnn-hp-rail-link--latest-with-thumb" : ""}`}
                                    {...homepageStoryLinkZjs(
                                      story.title,
                                      newsHref(story),
                                      "latest"
                                    )}
                                  >
                                    {hasThumb && <TrendingRailThumb story={story} />}
                                    <div className="cnn-hp-rail-text">
                                      <span
                                        className={`cnn-hp-rail-headline line-clamp-3${story.isBreaking ? " cnn-hp-rail-headline--breaking" : ""}`}
                                      >
                                        {story.title}
                                      </span>
                                      {dateSrc && (
                                        <span className="cnn-hp-rail-date">
                                          {formatDate(dateSrc, "MMM dd", language)}
                                        </span>
                                      )}
                                    </div>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {videoStories.length > 0 && (
                          <div>
                            <h2 className="cnn-hp-section-heading border-l-4 border-[#cc0000] pl-3 mb-3">
                              Video
                            </h2>
                            <Link
                              href={newsHref(videoStories[0])}
                              className="group block"
                              {...homepageStoryLinkZjs(
                                videoStories[0].title,
                                newsHref(videoStories[0]),
                                "video-spotlight"
                              )}
                            >
                              <div className="relative aspect-video overflow-hidden rounded-sm mb-2">
                                <MediaImage
                                  story={videoStories[0]}
                                  alt={videoStories[0].title}
                                  sizes="400px"
                                  className="group-hover:scale-[1.02] transition-transform duration-300"
                                />
                                <div className="absolute top-2 left-2">
                                  <span className="bg-black text-white text-[12px] font-bold uppercase tracking-wide px-2 py-1">
                                    Video
                                  </span>
                                </div>
                              </div>
                              <h3 className="cnn-hp-secondary-headline cnn-hp-secondary-headline--sm group-hover:text-[#cc0000] transition-colors line-clamp-2">
                                {videoStories[0].title}
                              </h3>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
          </div>
        </div>

        <InlineAdPlacement index={0} />

        {/* Category-driven columns — reflects admin categories on news */}
        {categoryColumns.length > 0 && (
          <div
            className="zone zone--t-light"
            data-track-zone="homepage_categories"
            data-uri="cms.local/_components/zone/instances/homepage-categories@published"
          >
            <div className="zone__inner">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10 py-8 border-t border-[#e6e6e6]">
                {categoryColumns.map(({ category, news }) => {
                  const [lead, ...rest] = news;
                  const sub = rest.slice(0, 2);
                  if (!lead) return null;
                  const title = categoryTitle(category, language);
                  const isFallbackCategory = category.id.startsWith("fallback-");
                  return (
                    <div key={category.id}>
                      {isFallbackCategory ? (
                        <h2 className="cnn-hp-section-heading border-l-4 border-[#cc0000] pl-3 mb-3">
                          {title}
                        </h2>
                      ) : (
                        <Link
                          href={categorySectionHref(category.slug)}
                          className="block mb-3"
                          {...homepageStoryLinkZjs(
                            title,
                            categorySectionHref(category.slug),
                            "category-nav"
                          )}
                        >
                          <h2 className="cnn-hp-section-heading border-l-4 border-[#cc0000] pl-3 hover:text-[#cc0000] transition-colors">
                            {title}
                          </h2>
                        </Link>
                      )}
                      <div className="space-y-3">
                        <Link
                          href={newsHref(lead)}
                          className="group block"
                          {...homepageStoryLinkZjs(
                            lead.title,
                            newsHref(lead),
                            "category-lead"
                          )}
                        >
                          <div className="relative w-full h-48 overflow-hidden rounded-md mb-3 shadow-sm">
                            <MediaImage
                              story={lead}
                              alt={lead.title}
                              sizes="(max-width: 768px) 100vw, 400px"
                            />
                            {isStoryVideo(lead) && <CnnVideoPlayOverlay />}
                          </div>
                          <h3
                            className={`cnn-hp-secondary-headline group-hover:text-[#cc0000] transition-colors line-clamp-2 mb-1${lead.isBreaking ? " cnn-hp-secondary-headline--breaking" : ""}`}
                          >
                            {lead.title}
                          </h3>
                          {lead.publishedAt && (
                            <p className="cnn-hp-meta">
                              {formatRelativeTime(lead.publishedAt)}
                            </p>
                          )}
                        </Link>
                        <ul className="space-y-2 list-none p-0 m-0 border-t border-[#eee] pt-2">
                          {sub.map((story) => (
                            <li
                              key={story.id}
                              className="pb-2 border-b border-[#f0f0f0] last:border-0"
                            >
                              <Link
                                href={newsHref(story)}
                                className="block hover:text-[#cc0000] transition-colors"
                                {...homepageStoryLinkZjs(
                                  story.title,
                                  newsHref(story),
                                  "category-sub"
                                )}
                              >
                                {isStoryVideo(story) && (
                                  <CnnVideoTextLabel compact />
                                )}
                                <span
                                  className={`cnn-hp-secondary-headline cnn-hp-secondary-headline--sm line-clamp-2${story.isBreaking ? " cnn-hp-secondary-headline--breaking" : ""}`}
                                >
                                  {story.title}
                                </span>
                              </Link>
                              {story.publishedAt && (
                                <p className="cnn-hp-meta mt-1">
                                  {formatRelativeTime(story.publishedAt)}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <InlineAdPlacement index={1} />

        {/* Shorts-style video shelf */}
        {videoShelf.length > 1 && (
          <div
            className="product-zone product-zone--t-light cnn-hp-shorts-zone layout--full-width"
            data-track-zone="homepage_shorts"
            data-uri="cms.local/_components/product-zone/instances/homepage-shorts@published"
          >
            <div className="product-zone__inner has-pseudo-class-fix-layout--full-width">
              <h2 className="product-zone__title product-zone__title--full-width-size-l0 cnn-hp-shorts-title">
                Shorts
              </h2>
              <div className="product-zone__items layout--full-width">
                <div className="container_vertical-shelf-carousel cnn-hp-vertical-shelf-embedded">
                  <div className="container_vertical-shelf-carousel__cards-wrapper">
                    <div className="container_vertical-shelf-carousel__field-wrapper">
                      <ul className="container_vertical-shelf-carousel__field-links">
                        {videoShelf.map((story) => (
                          <li
                            key={story.id}
                            className="container_vertical-shelf-carousel__item"
                          >
                            <Link
                              href={newsHref(story)}
                              className="container_vertical-shelf-carousel__link"
                              {...homepageStoryLinkZjs(
                                story.title,
                                newsHref(story),
                                "shorts"
                              )}
                            >
                              <div className="container_vertical-shelf-carousel__item-media-wrapper">
                                <div className="container_vertical-shelf-carousel__item-media relative w-full h-full">
                                  <MediaImage
                                    story={story}
                                    alt={story.title}
                                    sizes="280px"
                                  />
                                </div>
                              </div>
                              <div className="container_vertical-shelf-carousel__text">
                                <span className="container__text-label--type-video">
                                  Video
                                </span>
                                <h3 className="container_vertical-shelf-carousel__headline">
                                  <span className="container_vertical-shelf-carousel__headline-text">
                                    {story.title}
                                  </span>
                                </h3>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <CnnLabeledAdStrip slot="MID_PAGE" />
    </section>
    </InlineAdProvider>
  );
}
