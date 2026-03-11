"use client";

import { News } from "@/types/news.types";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import Link from "next/link";
import { TYPOGRAPHY } from "@/lib/constants/typography";

interface TrendingListProps {
  news: News[];
  title?: string;
  maxItems?: number;
  showNumbers?: boolean;
}

export function TrendingList({ 
  news, 
  title = "TRENDING", 
  maxItems = 5,
  showNumbers = true 
}: TrendingListProps) {
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
              borderBottom: index < displayNews.length - 1 ? '1px solid #f0f0f0' : 'none'
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
              {showNumbers && (
                <div 
                  className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold"
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3
                  className={`${TYPOGRAPHY.SIDEBAR_TITLE.fontSize.className} line-clamp-2 mb-1`}
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
