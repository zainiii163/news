"use client";

import { formatRelativeTime } from "@/lib/helpers/formatDate";
import Link from "next/link";

interface TrendingNewsProps {
  articles: Array<{
    title: string;
    date?: string | Date;
    url?: string;
    id: string;
  }>;
  title?: string;
  maxItems?: number;
  className?: string;
}

export function TrendingNews({ 
  articles, 
  title = "TRENDING",
  maxItems = 5,
  className = ""
}: TrendingNewsProps) {
  if (!articles || articles.length === 0) return null;

  const displayArticles = articles.slice(0, maxItems);

  return (
    <div className={`bg-white ${className}`}>
      {/* Section Title */}
      {title && (
        <div 
          className="mb-4 pb-3"
          style={{
            borderBottom: '1px solid #e6e6e6',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            color: '#0A0A0A',
          }}
        >
          {title}
        </div>
      )}

      {/* Vertical List - Simple Text Layout */}
      <div className="space-y-0">
        {displayArticles.map((article, index) => (
          <div 
            key={article.id} 
            className="py-3"
            style={{ 
              borderBottom: index < displayArticles.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}
          >
            <Link
              href={article.url || `/news/${article.id}`}
              className="block group"
              style={{
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
            >
              <h3
                className="line-clamp-2 mb-1"
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  lineHeight: '1.4',
                  color: '#0A0A0A',
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
              
              {article.date && (
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 400,
                    color: '#6B6B6B',
                    letterSpacing: '0.2px',
                  }}
                >
                  {formatRelativeTime(article.date)}
                </div>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
