"use client";

import { News } from "@/types/news.types";
import { SectionHeader } from "@/components/ui/section-header";
import { VerticalNewsCard } from "@/components/ui/news-cards";
import { TextNewsLink } from "@/components/ui/news-cards";

interface FeaturedSectionProps {
  featuredStories: News[];
}

export function FeaturedSection({ featuredStories }: FeaturedSectionProps) {
  // Group stories into 3 columns for editorial layout
  const columns = [
    featuredStories.slice(0, 4),
    featuredStories.slice(4, 8),
    featuredStories.slice(8, 12)
  ];

  return (
    <section className="cnn-container mt-12">
      <SectionHeader title="Featured" accentColor="red" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {columns.map((columnStories, columnIndex) => (
          <div key={columnIndex} className="space-y-4">
            {/* Main featured article in column */}
            {columnStories[0] && (
              <div>
                {columnStories[0].category && (
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2 block">
                    {columnStories[0].category.nameEn || columnStories[0].category.nameIt}
                  </span>
                )}
                <VerticalNewsCard 
                  story={columnStories[0]} 
                  showCategory={false}
                  size="large"
                />
              </div>
            )}
            
            {/* Supporting text links */}
            <div className="space-y-3 pt-2">
              {columnStories.slice(1, 4).map((story) => (
                <TextNewsLink
                  key={story.id}
                  story={story}
                  showBullet={true}
                  size="small"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
