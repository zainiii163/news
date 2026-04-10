"use client";

import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";
import type { Language } from "@/lib/i18n/translations";
import type { News } from "@/types/news.types";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
  isYouTubeUrl,
} from "@/lib/helpers/youtube";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import { OptimizedImage } from "@/components/ui/optimized-image";

function newsHref(story: News) {
  return `/news/${story.slug || story.id}`;
}

function categoryLabel(story: News, language: Language): string | null {
  const c = story.category;
  if (!c) return null;
  if (language === "it") {
    return c.nameIt?.trim() || c.nameEn || null;
  }
  return c.nameEn?.trim() || c.nameIt || null;
}

function PlayTriangleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path fill="currentColor" d="M8 5v14l11-7z" />
    </svg>
  );
}

function HeroPlayer({ story }: { story: News }) {
  const yt = story.youtubeUrl?.trim();
  if (yt && isYouTubeUrl(yt)) {
    const embed = getYouTubeEmbedUrl(yt);
    if (!embed) return null;
    return (
      <div className="watch-hero-stage aspect-video w-full bg-black">
        <iframe
          title={story.title}
          src={`${embed}?rel=0`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  const main = story.mainImage?.trim();
  if (main && /\.(mp4|webm|ogg|mov)(\?|$)/i.test(main)) {
    return (
      <div className="watch-hero-stage aspect-video w-full bg-black">
        <video
          className="h-full w-full"
          controls
          playsInline
          preload="metadata"
          src={getImageUrl(main)}
        />
      </div>
    );
  }

  return null;
}

function VideoThumb({ story, alt }: { story: News; alt: string }) {
  const yt = story.youtubeUrl?.trim();
  if (yt && isYouTubeUrl(yt)) {
    const thumb = getYouTubeThumbnail(yt, "high");
    if (thumb) {
      return (
        <OptimizedImage
          src={thumb}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="lazy"
          quality={78}
        />
      );
    }
  }
  const main = story.mainImage?.trim();
  if (main && /\.(mp4|webm|ogg|mov)(\?|$)/i.test(main)) {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        preload="metadata"
        src={getImageUrl(main)}
        aria-hidden
      />
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-neutral-400 text-sm">
      Video
    </div>
  );
}

const EMPTY_SPOTLIGHT = {
  en: [
    {
      key: "calabria",
      title: "Calabria & region",
      meta: "Local reports & breaking news",
    },
    {
      key: "italy-world",
      title: "Italy & the world",
      meta: "Politics, economy, international",
    },
    {
      key: "sport-culture",
      title: "Sport & culture",
      meta: "Matches, events, entertainment",
    },
  ],
  it: [
    {
      key: "calabria",
      title: "Calabria e territorio",
      meta: "Cronaca e approfondimenti locali",
    },
    {
      key: "italy-world",
      title: "Italia e mondo",
      meta: "Politica, economia, esteri",
    },
    {
      key: "sport-culture",
      title: "Sport e cultura",
      meta: "Eventi, spettacolo, rassegne",
    },
  ],
} as const;

export function WatchClient({ initialVideos }: { initialVideos: News[] }) {
  const { language } = useLanguage();
  const isIt = language === "it";

  const [featured, ...rest] = initialVideos;
  const featuredCategory = featured
    ? categoryLabel(featured, language)
    : null;

  const spotlight = isIt ? EMPTY_SPOTLIGHT.it : EMPTY_SPOTLIGHT.en;

  return (
    <div className="watch-page min-h-screen bg-[#fafafa] pb-20">
      <header className="watch-masthead border-b border-[#e6e6e6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="watch-kicker mb-2">
            {isIt ? "Guarda" : "Watch"}
          </p>
          <h1 className="watch-title mb-4">
            {isIt ? "Video TG Calabria" : "TG Calabria Video"}
          </h1>
          <p className="watch-subtitle">
            {isIt
              ? "Servizi giornalistici, interviste e clip video dalla redazione. La Calabria, l’Italia e il mondo in movimento."
              : "Journalism on camera — field reports, interviews, and clips from our newsroom. Calabria, Italy, and the world in motion."}
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {!featured ? (
          <>
            <section
              className="mb-10"
              aria-label={isIt ? "Area video principale" : "Main video area"}
            >
              <div className="watch-hero-placeholder max-w-5xl mx-auto">
                <div className="watch-hero-placeholder__inner">
                  <div className="watch-hero-placeholder__play" aria-hidden>
                    <PlayTriangleIcon className="ml-1" />
                  </div>
                  <span className="watch-hero-placeholder__label">
                    {isIt ? "In attesa del primo video" : "Your video hub"}
                  </span>
                  <p className="watch-hero-placeholder__hint">
                    {isIt
                      ? "Pubblica un articolo con URL YouTube o un file video come immagine principale: apparirà qui automaticamente."
                      : "Publish a story with a YouTube URL or a video file as the main asset — it will surface here automatically."}
                  </p>
                </div>
              </div>

              <div className="max-w-3xl mx-auto mt-8 text-center sm:text-left">
                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                  {isIt ? "Nessun video ancora" : "No videos yet"}
                </h2>
                <p className="text-neutral-600 leading-relaxed mb-6">
                  {isIt
                    ? "La griglia si riempie appena la redazione pubblica contenuti video. Nel frattempo puoi seguire tutte le notizie su TG Calabria."
                    : "The grid fills up as soon as editors publish video stories. In the meantime, follow all coverage on the homepage and in our sections."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                  <Link href="/" className="watch-btn-primary">
                    {isIt ? "Vai alla homepage" : "Back to home"}
                  </Link>
                  <Link href="/news" className="watch-btn-secondary">
                    {isIt ? "Tutte le notizie" : "All news"}
                  </Link>
                </div>
              </div>
            </section>

            <section className="mb-10" aria-labelledby="watch-spotlight-heading">
              <h2
                id="watch-spotlight-heading"
                className="watch-section-title"
              >
                {isIt ? "Cosa troverai qui" : "What you’ll find here"}
              </h2>
              <ul className="grid gap-4 sm:grid-cols-3 list-none p-0 m-0">
                {spotlight.map((item) => (
                  <li key={item.key}>
                    <div className="watch-spotlight-tile h-full min-h-[140px]">
                      <PlayTriangleIcon className="watch-spotlight-tile__icon" />
                      <span className="watch-spotlight-tile__title">
                        {item.title}
                      </span>
                      <span className="watch-spotlight-tile__meta">
                        {item.meta}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <>
            <section
              className="mb-12 lg:mb-14"
              aria-labelledby="watch-featured-heading"
            >
              <h2 id="watch-featured-heading" className="watch-section-title">
                {isIt ? "In evidenza" : "Featured"}
              </h2>
              <div className="max-w-5xl">
                <HeroPlayer story={featured} />
              </div>
              <div className="mt-5 max-w-5xl flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {featuredCategory && (
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#c70000]">
                      {featuredCategory}
                    </span>
                  )}
                  <Link href={newsHref(featured)} className="group block">
                    <h3 className="text-xl sm:text-2xl lg:text-[1.65rem] font-extrabold text-neutral-900 mt-1 leading-tight group-hover:text-[#c70000] transition-colors">
                      {featured.title}
                    </h3>
                  </Link>
                  {featured.summary && (
                    <p className="text-neutral-600 mt-2 line-clamp-3 text-[1.02rem] leading-relaxed">
                      {featured.summary}
                    </p>
                  )}
                  {featured.publishedAt && (
                    <p className="text-sm text-neutral-500 mt-3">
                      {formatRelativeTime(featured.publishedAt)}
                    </p>
                  )}
                </div>
                <Link
                  href={newsHref(featured)}
                  className="watch-btn-primary shrink-0 self-start sm:self-center"
                >
                  {isIt ? "Apri articolo" : "Full story"}
                </Link>
              </div>
            </section>

            {rest.length > 0 && (
              <section aria-labelledby="watch-more-heading">
                <h2 id="watch-more-heading" className="watch-section-title">
                  {isIt ? "Altri video" : "More videos"}
                </h2>
                <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 list-none p-0 m-0">
                  {rest.map((story) => {
                    const cat = categoryLabel(story, language);
                    return (
                      <li key={story.id}>
                        <Link
                          href={newsHref(story)}
                          className="watch-card group block h-full"
                        >
                          <div className="watch-thumb">
                            <VideoThumb story={story} alt={story.title} />
                            <span className="watch-badge">
                              {isIt ? "Video" : "Video"}
                            </span>
                            <div className="watch-thumb__overlay" aria-hidden>
                              <span className="watch-play-circle">
                                <PlayTriangleIcon className="ml-0.5" />
                              </span>
                            </div>
                          </div>
                          <div className="p-4 pt-3">
                            {cat && (
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c70000]">
                                {cat}
                              </span>
                            )}
                            <h3 className="font-extrabold text-neutral-900 line-clamp-2 mt-1 leading-snug group-hover:text-[#c70000] transition-colors">
                              {story.title}
                            </h3>
                            {story.publishedAt && (
                              <p className="text-xs text-neutral-500 mt-2 font-medium">
                                {formatRelativeTime(story.publishedAt)}
                              </p>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
