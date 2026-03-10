"use client";

import { News } from "@/types/news.types";
import { SectionHeader } from "@/components/ui/section-header";
import { VerticalNewsCard } from "@/components/ui/news-cards";

interface LatestStoriesSectionProps {
  latestStories: News[];
}

export function LatestStoriesSection({ latestStories }: LatestStoriesSectionProps) {
  return (
    <section className="cnn-container mt-12">
      <SectionHeader title="Latest Stories" accentColor="black" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {latestStories.slice(0, 8).map((story) => (
          <VerticalNewsCard
            key={story.id}
            story={story}
            showCategory={false}
            size="medium"
          />
        ))}
      </div>
    </section>
  );
}
