"use client";

import { News } from "@/types/news.types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import Link from "next/link";
import { TYPOGRAPHY } from "@/lib/constants/typography";

interface LatestNewsListProps {
  news: News[];
  title?: string;
  maxItems?: number;
}

export function LatestNewsList({ 
  news, 
  title = "LATEST NEWS", 
  maxItems = 6 
}: LatestNewsListProps) {
  if (!news || news.length === 0) return null;

  const displayNews = news.slice(0, maxItems);

  return (
    <div className="bg-white">
      {/* Section Title */}
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

      {/* Vertical List - Simple Text Layout */}
      <div className="space-y-0">
        {displayNews.map((article, index) => (
          <div
            key={article.id}
            className="py-3"
            style={{
              borderBottom: index < displayNews.length - 1 ? '1px solid #f0f0f0' : 'none',
            }}
          >
            <Link
              href={`/news/${article.slug || article.id}`}
              className="flex gap-3 group"
              style={{
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Small thumbnail - CNN style */}
              {article.mainImage && article.mainImage.trim() !== "" && (
                <div 
                  className="relative flex-shrink-0 overflow-hidden"
                  style={{
                    width: '80px',
                    height: '60px',
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  <OptimizedImage
                    src={getImageUrl(article.mainImage)}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    quality={75}
                    sizes="80px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3
                  className={`${TYPOGRAPHY.SIDEBAR_TITLE.fontSize.className} line-clamp-2`}
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
                <div
                  className="mt-1.5"
                  style={{
                    fontSize: '11px',
                    fontWeight: 400,
                    color: '#6B6B6B',
                    letterSpacing: '0.2px',
                  }}
                >
                  {formatRelativeTime(article.createdAt)}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
