"use client";

import { memo } from "react";
import Image from "next/image";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import { useLanguage } from "@/providers/LanguageProvider";
import Link from "next/link";
import { TYPOGRAPHY } from "@/lib/constants/typography";
import { News } from "@/types/news.types";
import { Category } from "@/types/category.types";

interface CategoryNewsGridProps {
  categoryStories: Record<string, { category: Category; news: News[] }>;
  maxPerCategory?: number;
  title?: string;
}

function CategorySection({ category, news, maxPerCategory = 4 }: { 
  category: Category; 
  news: News[]; 
  maxPerCategory?: number;
}) {
  const { language } = useLanguage();

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="mb-4">
        <Link href={`/category/${category.slug}`} className="group block">
          <h2 
            className={`${TYPOGRAPHY.CATEGORY_LABEL.fontSize.className} text-gray-900 border-b-2 border-red-600 pb-1 inline-block group-hover:text-red-600 transition`}
          >
            {language === "it" ? category.nameIt : category.nameEn}
          </h2>
        </Link>
      </div>
      
      {/* News Grid - Alternating layout */}
      <div className="space-y-4">
        {news.slice(0, maxPerCategory).map((story, index) => (
          <Link
            key={story.id}
            href={`/news/${story.slug || story.id}`}
            className="group block"
            style={{
              textDecoration: 'none',
            }}
          >
            <div 
              className={`flex gap-4 ${index % 2 === 1 ? 'flex-row-reverse' : ''} flex-col md:flex-row`}
              style={{
                borderBottom: index < Math.min(maxPerCategory, news.length) - 1 ? '1px solid #e6e6e6' : 'none',
                paddingBottom: index < Math.min(maxPerCategory, news.length) - 1 ? '16px' : '0',
                marginBottom: index < Math.min(maxPerCategory, news.length) - 1 ? '16px' : '0',
              }}
            >
              {/* Image */}
              {story.mainImage && story.mainImage.trim() !== "" ? (
                <div 
                  className="relative flex-shrink-0 overflow-hidden w-full md:w-48 h-32 md:h-32"
                  style={{
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  <Image
                    src={story.mainImage}
                    alt={story.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    quality={85}
                    sizes="(max-width: 768px) 100vw, 200px"
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                  {story.isBreaking && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 z-10">
                      <span className={TYPOGRAPHY.BREAKING_BADGE.fontSize.className}>BREAKING</span>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="w-full md:w-48 h-32 md:h-32 bg-gray-200 flex items-center justify-center"
                  style={{
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  <p className="text-sm text-gray-500">Image not available</p>
                </div>
              )}
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className={`${TYPOGRAPHY.ARTICLE_TITLE.fontSize.className} text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2`}>
                  {story.title}
                </h3>
                {story.summary && (
                  <p className={`${TYPOGRAPHY.ARTICLE_SUMMARY.fontSize.className} mb-2 hidden sm:block`}>
                    {story.summary}
                  </p>
                )}
                <div className={TYPOGRAPHY.TIMESTAMP.fontSize.className}>
                  {formatRelativeTime(story.createdAt)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* More Link */}
      {news.length > maxPerCategory && (
        <div className="mt-4">
          <Link
            href={`/category/${category.slug}`}
            className="text-sm text-red-600 hover:text-red-700 font-extrabold uppercase tracking-wide transition"
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {language === "it" ? "ALTRO DA" : "MORE FROM"} {language === "it" ? category.nameIt : category.nameEn} →
          </Link>
        </div>
      )}
    </div>
  );
}

export const CategoryNewsGrid = memo(function CategoryNewsGrid({ 
  categoryStories, 
  maxPerCategory = 4,
  title = "CATEGORIES"
}: CategoryNewsGridProps) {
  const categories = Object.values(categoryStories);

  if (categories.length === 0) return null;

  return (
    <div className="bg-white">
      {title && (
        <div 
          className="mb-6"
          style={{
            borderBottom: '2px solid #CC0000',
            paddingBottom: '8px',
          }}
        >
          <h2 className={`${TYPOGRAPHY.CATEGORY_LABEL.fontSize.className} text-gray-900`}>
            {title}
          </h2>
        </div>
      )}
      
      <div className="space-y-8">
        {categories.map(({ category, news }) => (
          <CategorySection 
            key={category.id} 
            category={category} 
            news={news} 
            maxPerCategory={maxPerCategory}
          />
        ))}
      </div>
    </div>
  );
});

CategoryNewsGrid.displayName = 'CategoryNewsGrid';
