"use client";

import { News } from "@/types/news.types";
import { SectionHeader } from "@/components/ui/section-header";
import { VerticalNewsCard } from "@/components/ui/news-cards";
import { HorizontalNewsCard } from "@/components/ui/news-cards";

interface CategorySectionProps {
  category: NonNullable<News["category"]>;
  news: News[];
  accentColor?: "red" | "black" | "blue" | "green" | "purple" | "gray";
}

export function CategorySection({ 
  category, 
  news, 
  accentColor = "blue" 
}: CategorySectionProps) {
  if (news.length === 0) return null;

  return (
    <section className="cnn-container mt-12">
      <SectionHeader 
        title={category.nameEn || category.nameIt || 'Category'} 
        accentColor={accentColor} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main featured story */}
        <div className="lg:col-span-2">
          {news[0] && (
            <VerticalNewsCard
              story={news[0]}
              showCategory={false}
              size="large"
            />
          )}
        </div>
        
        {/* Supporting stories */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide mb-4">
            More {category.nameEn || category.nameIt}
          </h3>
          <div className="space-y-4">
            {news.slice(1, 4).map((story) => (
              <HorizontalNewsCard
                key={story.id}
                story={story}
                imageSize="large"
                showCategory={false}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Grid of smaller stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {news.slice(4, 7).map((story) => (
          <VerticalNewsCard
            key={story.id}
            story={story}
            showCategory={false}
            size="small"
          />
        ))}
      </div>
    </section>
  );
}
