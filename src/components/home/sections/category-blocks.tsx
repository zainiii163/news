"use client";

import Link from "next/link";
import { News } from "@/types/news.types";
import { NewsCard } from "@/components/ui/news-card";
import { Category } from "@/types/category.types";
import { useLanguage } from "@/providers/LanguageProvider";

interface CategoryBlocksProps {
  categoryStories: Record<string, { category: Category; news: News[] }>;
  maxPerCategory?: number;
}

export function CategoryBlocks({
  categoryStories,
  maxPerCategory = 4,
}: CategoryBlocksProps) {
  const { language } = useLanguage();
  const categories = Object.values(categoryStories);

  if (categories.length === 0) return null;

  return (
    <div className="space-y-8">
      {categories.map(({ category, news }) => (
        <div key={category.id} className="">
          {/* Section Header */}
          <div className="mb-6">
            <Link href={`/category/${category.slug}`} className="group">
              <h2 className="text-lg font-extrabold uppercase tracking-wide text-gray-900 border-b-2 border-red-600 pb-1 inline-block group-hover:text-red-600 transition">
                {language === "it" ? category.nameIt : category.nameEn}
              </h2>
            </Link>
          </div>
          
          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {news.slice(0, maxPerCategory).map((story) => (
              <NewsCard key={story.id} news={story} />
            ))}
          </div>
          
          {/* More Link */}
          {news.length > maxPerCategory && (
            <div className="mt-4">
              <Link
                href={`/category/${category.slug}`}
                className="text-sm text-red-600 hover:text-red-700 font-extrabold uppercase tracking-wide transition"
              >
                {language === "it" ? "ALTRO DA" : "MORE FROM"} {language === "it" ? category.nameIt : category.nameEn} →
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

