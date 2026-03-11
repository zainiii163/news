"use client";

import { News } from "@/types/news.types";
import { SectionHeader } from "@/components/ui/section-header";
import { VerticalNewsCard } from "@/components/ui/news-cards";
import { TextNewsLink } from "@/components/ui/news-cards";

interface WorldSectionProps {
  worldStories: News[];
}

export function WorldSection({ worldStories }: WorldSectionProps) {
  if (worldStories.length === 0) return null;

  return (
    <section className="cnn-container mt-12">
      <SectionHeader title="World" accentColor="green" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main world story */}
        <div className="lg:col-span-2">
          {worldStories[0] && (
            <VerticalNewsCard
              story={worldStories[0]}
              showCategory={true}
              size="large"
            />
          )}
        </div>
        
        {/* Side world stories */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide mb-4">
            More World News
          </h3>
          <div className="space-y-3">
            {worldStories.slice(1, 6).map((story) => (
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
    </section>
  );
}
