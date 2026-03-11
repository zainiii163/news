"use client";

import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import Link from "next/link";
import { TYPOGRAPHY } from "@/lib/constants/typography";

interface SideNewsListProps {
  news: News[];
  title?: string;
  maxItems?: number;
}

export function SideNewsList({ 
  news, 
  title, 
  maxItems = 5 
}: SideNewsListProps) {
  if (!news || news.length === 0) return null;

  const displayNews = news.slice(0, maxItems);

  return (
    <div className="bg-white">
      {title && (
        <div 
          className="mb-4 pb-3"
          style={{
            borderBottom: '1px solid #e6e6e6',
          }}
        >
          <div className={TYPOGRAPHY.CATEGORY_LABEL.fontSize.className}>
            {title}
          </div>
        </div>
      )}
      <div className="space-y-0">
        {displayNews.map((article, index) => (
          <div 
            key={article.id} 
            className="py-3"
            style={{ 
              borderBottom: index < displayNews.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}
          >
            <Link
              href={`/news/${article.slug || article.id}`}
              className="block group"
              style={{
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
            >
              <h3
                className={`${TYPOGRAPHY.SIDEBAR_TITLE.fontSize.className} line-clamp-3 mb-2`}
                style={{
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#CC0000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#0A0A0A';
                }}
              >
                {article.title}
              </h3>
              <div className={TYPOGRAPHY.TIMESTAMP.fontSize.className}>
                {formatRelativeTime(article.createdAt)}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
