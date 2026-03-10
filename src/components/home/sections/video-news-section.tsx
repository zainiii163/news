"use client";

import { News } from "@/types/news.types";
import { SectionHeader } from "@/components/ui/section-header";
import { VideoCard } from "@/components/ui/news-cards";

interface VideoNewsSectionProps {
  videoStories: News[];
}

export function VideoNewsSection({ videoStories }: VideoNewsSectionProps) {
  if (videoStories.length === 0) return null;

  return (
    <section className="cnn-container mt-12">
      <SectionHeader title="Video" accentColor="purple" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {videoStories.slice(0, 8).map((story) => (
          <VideoCard
            key={story.id}
            story={story}
            showDuration={true}
          />
        ))}
      </div>
    </section>
  );
}
