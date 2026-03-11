"use client";

import { News } from "@/types/news.types";
import { FeaturedSection } from "./featured-section";
import { LatestStoriesSection } from "./latest-stories-section";
import { VideoNewsSection } from "./video-news-section";
import { WorldSection } from "./world-section";
import { CategorySection } from "./category-section";

interface EditorialSectionsProps {
  featuredStories: News[];
  latestStories: News[];
  categoryStories: Record<string, { category: NonNullable<News["category"]>; news: News[] }>;
  videoStories: News[];
  worldStories: News[];
}

export function EditorialSections({
  featuredStories,
  latestStories,
  categoryStories,
  videoStories,
  worldStories,
}: EditorialSectionsProps) {
  return (
    <div className="space-y-0">
      {/* FEATURED SECTION */}
      <FeaturedSection featuredStories={featuredStories} />
      
      {/* LATEST STORIES GRID */}
      <LatestStoriesSection latestStories={latestStories} />
      
      {/* CATEGORY SECTIONS */}
      {Object.entries(categoryStories).slice(0, 3).map(([categoryId, { category, news }], index) => {
        const accentColors = ["blue", "green", "purple"] as const;
        return (
          <CategorySection
            key={categoryId}
            category={category}
            news={news}
            accentColor={accentColors[index % accentColors.length]}
          />
        );
      })}
      
      {/* VIDEO SECTION */}
      <VideoNewsSection videoStories={videoStories} />
      
      {/* WORLD SECTION */}
      <WorldSection worldStories={worldStories} />
    </div>
  );
}
