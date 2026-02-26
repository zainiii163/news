"use client";

import Link from "next/link";
import { HomepageSection } from "@/lib/api/modules/homepage.api";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { isYouTubeUrl, getYouTubeThumbnail } from "@/lib/helpers/youtube";
import { formatRelativeTime, formatDate } from "@/lib/helpers/formatDate";
import { News } from "@/types/news.types";

// Helper function to format video duration (mock - replace with actual duration if available)
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

interface HomepageSectionsProps {
  sections: HomepageSection[];
}

export function HomepageSections({ sections }: HomepageSectionsProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className="container_ribbon">
      <div className="cnn-container">
        {sections.map((section) => (
          <HomepageSectionRenderer key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}

function HomepageSectionRenderer({ section }: { section: HomepageSection }) {
  const news = (section.data || []) as unknown as News[];

  // If section has no data, show empty state
  if (!news || news.length === 0) {
    return (
      <div className="py-4 border-t border-gray-200 p-4 text-center">
        {section.title && (
          <h2 className="text-2xl font-extrabold mb-2 text-gray-900">
            {section.title}
          </h2>
        )}
        <p className="text-base text-gray-700 mb-2">
          {section.dataSource === "manual"
            ? "No news items selected for this manual list. Please configure news items in the admin panel."
            : "No content available for this section. Please check the data source configuration."}
        </p>
      </div>
    );
  }

  switch (section.type) {
    case "HERO_SLIDER":
      return <HeroSliderSection section={section} news={news} />;
    case "BREAKING_TICKER":
      return <BreakingTickerSection section={section} news={news} />;
    case "FEATURED_SECTION":
      return <FeaturedSection section={section} news={news} />;
    case "CATEGORY_BLOCK":
      return <CategoryBlockSection section={section} news={news} />;
    case "MANUAL_LIST":
      return <ManualListSection section={section} news={news} />;
    default:
      return null;
  }
}

function HeroSliderSection({
  section,
  news,
}: {
  section: HomepageSection;
  news: News[];
}) {
  const mainStory = news[0];
  const sideStories = news.slice(1, 5);

  return (
    <div className="py-6 border-t border-[#E6E6E6]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Story - CNN Style Left Column (8 cols) */}
        <div className="lg:col-span-8">
          {mainStory && (
            <Link href={getNewsUrl(mainStory)}>
              <div className="group cursor-pointer">
                <div className="relative w-full h-[500px] mb-4 overflow-hidden">
                  {(mainStory.youtubeUrl && isYouTubeUrl(mainStory.youtubeUrl)) ? (
                    <div className="relative w-full h-full">
                      <OptimizedImage
                        src={getYouTubeThumbnail(mainStory.youtubeUrl, "maxres") || ""}
                        alt={mainStory.title}
                        fill
                        className="object-cover"
                        priority
                        loading="eager"
                        quality={90}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                      />
                      {/* Video Duration Badge - CNN Style */}
                      <div className="absolute bottom-3 left-3 bg-black/80 text-white px-2 py-1 text-xs font-semibold">
                        {formatVideoDuration()}
                      </div>
                      {/* Play Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                        <div className="bg-[#CC0000] p-4 opacity-90 group-hover:opacity-100 transition-opacity">
                          <svg
                            className="w-10 h-10 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
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
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                          <div className="bg-white/90 p-4 opacity-90 group-hover:opacity-100 transition-opacity">
                            <svg
                              className="w-10 h-10 text-gray-900"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <OptimizedImage
                          src={getImageUrl(mainStory.mainImage)}
                          alt={mainStory.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          priority
                          loading="eager"
                          quality={90}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                        />
                        {/* Text Overlay - CNN Style (optional, can be toggled) */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6">
                          <h1 className="text-[2rem] leading-[1.1] font-[900] text-white mb-2 group-hover:text-[#FFD700] transition-colors line-clamp-3 tracking-tight">
                            {mainStory.title}
                          </h1>
                          {mainStory.category && (
                            <div className="text-sm text-white/90 uppercase tracking-wide font-semibold mb-2">
                              {mainStory.category.nameEn}
                            </div>
                          )}
                          <div className="text-xs text-white/80">
                            {formatDate(mainStory.createdAt, "MMM dd, yyyy")}
                          </div>
                        </div>
                      </>
                    )
                  ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                  )}
                </div>
                {/* Text below image (shown when no overlay) - only for non-image stories */}
                {(!mainStory.mainImage || mainStory.mainImage.trim() === "") && (
                  <>
                    <h1 className="text-[2.5rem] leading-[1.1] font-[900] text-black mb-3 group-hover:text-[#CC0000] transition-colors line-clamp-3 tracking-tight">
                      {mainStory.title}
                    </h1>
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
                      <span>{formatDate(mainStory.createdAt, "MMM dd, yyyy")}</span>
                    </div>
                  </>
                )}
              </div>
            </Link>
          )}
        </div>

        {/* Side Stories - CNN Style Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {sideStories.map((story, index) => (
            <Link key={story.id} href={getNewsUrl(story)}>
              <div className="group cursor-pointer">
                <div className="relative w-full h-[140px] mb-2 overflow-hidden">
                  {(story.youtubeUrl && isYouTubeUrl(story.youtubeUrl)) ? (
                    <div className="relative w-full h-full">
                      <OptimizedImage
                        src={getYouTubeThumbnail(story.youtubeUrl, "medium") || ""}
                        alt={story.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                        quality={80}
                        sizes="(max-width: 768px) 100vw, 400px"
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
                        loading="lazy"
                        quality={80}
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                  )}
                </div>
                <h3 className="text-base leading-[1.3] font-[800] text-black group-hover:text-[#CC0000] transition-colors line-clamp-2 mb-1">
                  {story.title}
                </h3>
                <p className="text-xs text-[#666666]">
                  {formatRelativeTime(story.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function BreakingTickerSection({
  section,
  news,
}: {
  section: HomepageSection;
  news: News[];
}) {
  return (
    <div className="py-6 border-t border-[#E6E6E6]">
      {section.title && (
        <div className="mb-4 flex items-center gap-3">
          <div className="w-1 h-6 bg-black"></div>
          <h2 className="text-xs font-[800] uppercase tracking-[0.1em] text-black">
            {section.title}
          </h2>
        </div>
      )}
      <div className="bg-[#CC0000] text-white p-4">
        <div className="space-y-2">
          {news.slice(0, 5).map((story) => (
            <Link key={story.id} href={getNewsUrl(story)}>
              <div className="group cursor-pointer hover:bg-[#B30000] p-2 -mx-2 transition-colors">
                <h3 className="text-sm font-[800] line-clamp-1 group-hover:underline">
                  {story.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedSection({
  section,
  news,
}: {
  section: HomepageSection;
  news: News[];
}) {
  return (
    <div className="py-6 border-t border-[#E6E6E6]">
      {section.title && (
        <div className="mb-6 flex items-center gap-3">
          <div className="w-1 h-6 bg-black"></div>
          <h2 className="text-xs font-[800] uppercase tracking-[0.1em] text-black">
            {section.title}
          </h2>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.slice(0, 6).map((story) => (
          <Link key={story.id} href={getNewsUrl(story)}>
            <div className="group cursor-pointer">
              <div className="relative w-full h-[280px] mb-3 overflow-hidden">
                {(story.youtubeUrl && isYouTubeUrl(story.youtubeUrl)) ? (
                  <div className="relative w-full h-full">
                    <OptimizedImage
                      src={getYouTubeThumbnail(story.youtubeUrl, "high") || ""}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      quality={85}
                      loading="lazy"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/80 text-white px-2 py-1 text-xs font-semibold">
                      {formatVideoDuration()}
                    </div>
                    {/* Text Overlay - CNN Style */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/70 to-transparent p-4">
                      <h3 className="text-base leading-[1.2] font-[900] text-white mb-1 line-clamp-2 group-hover:text-[#FFD700] transition-colors">
                        {story.title}
                      </h3>
                      {story.category && (
                        <div className="text-xs text-white/90 uppercase tracking-wide font-semibold">
                          {story.category.nameEn}
                        </div>
                      )}
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
                      <div className="absolute bottom-3 left-3 bg-black/80 text-white px-2 py-1 text-xs font-semibold">
                        {formatVideoDuration()}
                      </div>
                      {/* Text Overlay - CNN Style */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/70 to-transparent p-4">
                        <h3 className="text-base leading-[1.2] font-[900] text-white mb-1 line-clamp-2 group-hover:text-[#FFD700] transition-colors">
                          {story.title}
                        </h3>
                        {story.category && (
                          <div className="text-xs text-white/90 uppercase tracking-wide font-semibold">
                            {story.category.nameEn}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <OptimizedImage
                        src={getImageUrl(story.mainImage)}
                        alt={story.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        quality={85}
                        loading="lazy"
                      />
                      {/* Text Overlay - CNN Style */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/70 to-transparent p-4">
                        <h3 className="text-base leading-[1.2] font-[900] text-white mb-1 line-clamp-2 group-hover:text-[#FFD700] transition-colors">
                          {story.title}
                        </h3>
                        {story.category && (
                          <div className="text-xs text-white/90 uppercase tracking-wide font-semibold">
                            {story.category.nameEn}
                          </div>
                        )}
                      </div>
                    </>
                  )
                ) : (
                  <div className="w-full h-full bg-gray-200"></div>
                )}
              </div>
              {story.summary && (
                <p className="text-sm text-[#4D4D4D] leading-[1.5] mb-2 line-clamp-2">
                  {story.summary}
                </p>
              )}
              <p className="text-xs text-[#666666]">
                {formatRelativeTime(story.createdAt)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CategoryBlockSection({
  section,
  news,
}: {
  section: HomepageSection;
  news: News[];
}) {
  // CNN-style three-column layout with images in center and text overlays
  const mainStory = news[0];
  const sideStories = news.slice(1, 4);
  
  return (
    <div className="py-6 border-t border-[#E6E6E6]">
      {section.title && (
        <div className="mb-6 flex items-center gap-3">
          <div className="w-1 h-6 bg-black"></div>
          <h2 className="text-xs font-[800] uppercase tracking-[0.1em] text-black">
            {section.title}
          </h2>
        </div>
      )}
      
      {/* CNN-style three-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {mainStory && (
            <Link href={getNewsUrl(mainStory)}>
              <div className="group cursor-pointer">
                <div className="relative w-full h-[300px] mb-3 overflow-hidden">
                  {(mainStory.youtubeUrl && isYouTubeUrl(mainStory.youtubeUrl)) ? (
                    <div className="relative w-full h-full">
                      <OptimizedImage
                        src={getYouTubeThumbnail(mainStory.youtubeUrl, "high") || ""}
                        alt={mainStory.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        quality={90}
                        loading="lazy"
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
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        quality={90}
                        loading="lazy"
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                  )}
                  {/* Text Overlay - CNN Style */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4">
                    <h3 className="text-lg leading-[1.2] font-[900] text-white mb-2 line-clamp-2 group-hover:text-[#FFD700] transition-colors">
                      {mainStory.title}
                    </h3>
                    {mainStory.category && (
                      <div className="text-xs text-white/90 uppercase tracking-wide font-semibold">
                        {mainStory.category.nameEn}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Middle Column */}
        <div className="space-y-4">
          {sideStories[0] && (
            <Link href={getNewsUrl(sideStories[0])}>
              <div className="group cursor-pointer">
                <div className="relative w-full h-[300px] mb-3 overflow-hidden">
                  {(sideStories[0].youtubeUrl && isYouTubeUrl(sideStories[0].youtubeUrl)) ? (
                    <div className="relative w-full h-full">
                      <OptimizedImage
                        src={getYouTubeThumbnail(sideStories[0].youtubeUrl, "high") || ""}
                        alt={sideStories[0].title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        quality={90}
                        loading="lazy"
                      />
                      <div className="absolute bottom-3 left-3 bg-black/80 text-white px-2 py-1 text-xs font-semibold">
                        {formatVideoDuration()}
                      </div>
                    </div>
                  ) : sideStories[0].mainImage && sideStories[0].mainImage.trim() !== "" ? (
                    sideStories[0].mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                      <div className="relative w-full h-full">
                        <video
                          src={getImageUrl(sideStories[0].mainImage)}
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
                        src={getImageUrl(sideStories[0].mainImage)}
                        alt={sideStories[0].title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        quality={90}
                        loading="lazy"
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                  )}
                  {/* Text Overlay - CNN Style */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4">
                    <h3 className="text-lg leading-[1.2] font-[900] text-white mb-2 line-clamp-2 group-hover:text-[#FFD700] transition-colors">
                      {sideStories[0].title}
                    </h3>
                    {sideStories[0].category && (
                      <div className="text-xs text-white/90 uppercase tracking-wide font-semibold">
                        {sideStories[0].category.nameEn}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {sideStories[1] && (
            <Link href={getNewsUrl(sideStories[1])}>
              <div className="group cursor-pointer">
                <div className="relative w-full h-[300px] mb-3 overflow-hidden">
                  {(sideStories[1].youtubeUrl && isYouTubeUrl(sideStories[1].youtubeUrl)) ? (
                    <div className="relative w-full h-full">
                      <OptimizedImage
                        src={getYouTubeThumbnail(sideStories[1].youtubeUrl, "high") || ""}
                        alt={sideStories[1].title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        quality={90}
                        loading="lazy"
                      />
                      <div className="absolute bottom-3 left-3 bg-black/80 text-white px-2 py-1 text-xs font-semibold">
                        {formatVideoDuration()}
                      </div>
                    </div>
                  ) : sideStories[1].mainImage && sideStories[1].mainImage.trim() !== "" ? (
                    sideStories[1].mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                      <div className="relative w-full h-full">
                        <video
                          src={getImageUrl(sideStories[1].mainImage)}
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
                        src={getImageUrl(sideStories[1].mainImage)}
                        alt={sideStories[1].title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        quality={90}
                        loading="lazy"
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                  )}
                  {/* Text Overlay - CNN Style */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4">
                    <h3 className="text-lg leading-[1.2] font-[900] text-white mb-2 line-clamp-2 group-hover:text-[#FFD700] transition-colors">
                      {sideStories[1].title}
                    </h3>
                    {sideStories[1].category && (
                      <div className="text-xs text-white/90 uppercase tracking-wide font-semibold">
                        {sideStories[1].category.nameEn}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Smaller articles below - CNN Style */}
      {news.length > 3 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.slice(3, 6).map((story) => (
            <Link key={story.id} href={getNewsUrl(story)}>
              <div className="group cursor-pointer">
                <div className="relative w-full h-[150px] mb-2 overflow-hidden">
                  {(story.youtubeUrl && isYouTubeUrl(story.youtubeUrl)) ? (
                    <OptimizedImage
                      src={getYouTubeThumbnail(story.youtubeUrl, "medium") || ""}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      quality={80}
                      loading="lazy"
                    />
                  ) : story.mainImage && story.mainImage.trim() !== "" ? (
                    <OptimizedImage
                      src={getImageUrl(story.mainImage)}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      quality={80}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                  )}
                </div>
                <h3 className="text-sm leading-[1.3] font-[800] text-black mb-1 line-clamp-2 group-hover:text-[#CC0000] transition-colors">
                  {story.title}
                </h3>
                <p className="text-xs text-[#666666]">
                  {formatRelativeTime(story.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ManualListSection({
  section,
  news,
}: {
  section: HomepageSection;
  news: News[];
}) {
  return (
    <div className="py-6 border-t border-[#E6E6E6]">
      {section.title && (
        <div className="mb-6 flex items-center gap-3">
          <div className="w-1 h-6 bg-black"></div>
          <h2 className="text-xs font-[800] uppercase tracking-[0.1em] text-black">
            {section.title}
          </h2>
        </div>
      )}
      <div className="space-y-0">
        {news.map((story, index) => (
          <Link key={story.id} href={`/news/${story.slug || story.id}`}>
            <div className={`flex gap-4 group cursor-pointer border-b border-[#E6E6E6] py-4 ${index === 0 ? 'pt-0' : ''} ${index === news.length - 1 ? 'border-b-0 pb-0' : ''} transition-colors hover:bg-[#FAFAFA]`}>
              <div className="relative w-[120px] h-[80px] shrink-0 overflow-hidden">
                {(story.youtubeUrl && isYouTubeUrl(story.youtubeUrl)) ? (
                  <div className="relative w-full h-full">
                    <OptimizedImage
                      src={getYouTubeThumbnail(story.youtubeUrl, "medium") || ""}
                      alt={story.title}
                      fill
                      className="object-cover"
                      quality={75}
                      loading="lazy"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/80 text-white px-1 py-0.5 text-[9px] font-semibold">
                      {formatVideoDuration()}
                    </div>
                  </div>
                ) : story.mainImage ? (
                  story.mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                    <div className="relative w-full h-full">
                      <video
                        src={getImageUrl(story.mainImage)}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="absolute bottom-1 left-1 bg-black/80 text-white px-1 py-0.5 text-[9px] font-semibold">
                        {formatVideoDuration()}
                      </div>
                    </div>
                  ) : (
                    <OptimizedImage
                      src={getImageUrl(story.mainImage)}
                      alt={story.title}
                      fill
                      className="object-cover"
                      quality={75}
                      loading="lazy"
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-gray-200"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base leading-[1.3] font-[800] text-black group-hover:text-[#CC0000] transition-colors line-clamp-2 mb-1">
                  {story.title}
                </h3>
                {story.summary && (
                  <p className="text-sm text-[#4D4D4D] leading-[1.5] line-clamp-2 mb-1">
                    {story.summary}
                  </p>
                )}
                <p className="text-xs text-[#666666]">
                  {formatRelativeTime(story.createdAt)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
