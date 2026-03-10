"use client";

import { News } from "@/types/news.types";
import { HeroCard } from "@/components/ui/news-cards";
import { HorizontalNewsCard } from "@/components/ui/news-cards";
import { TextNewsLink } from "@/components/ui/news-cards";

interface HeroSectionProps {
  heroStory: News | null;
  leftColumnStories: News[];
  rightColumnStories: News[];
}

export function HeroSection({
  heroStory,
  leftColumnStories,
  rightColumnStories,
}: HeroSectionProps) {
  return (
    <div className="mb-8">
      {/* CNN-STYLE 3-COLUMN HERO LAYOUT: 1fr 2fr 1fr */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN - SUPPORTING STORIES */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide mb-4">
            Top Stories
          </h3>
          {leftColumnStories.slice(0, 6).map((story) => (
            <HorizontalNewsCard
              key={story.id}
              story={story}
              imageSize="medium"
              showCategory={false}
            />
          ))}
        </div>

        {/* CENTER COLUMN - HERO ARTICLE */}
        <div className="lg:col-span-6">
          {heroStory && (
            <HeroCard story={heroStory} priority={true} />
          )}
        </div>

        {/* RIGHT COLUMN - TRENDING + LATEST NEWS */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide mb-4">
              Trending
            </h3>
            <div className="space-y-3">
              {rightColumnStories.slice(0, 4).map((story) => (
                <TextNewsLink
                  key={story.id}
                  story={story}
                  showBullet={true}
                  size="small"
                />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide mb-4">
              Latest
            </h3>
            <div className="space-y-3">
              {rightColumnStories.slice(4, 8).map((story) => (
                <TextNewsLink
                  key={story.id}
                  story={story}
                  showBullet={false}
                  size="small"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

