"use client";

import { News } from "@/types/news.types";
import { FeaturedArticleImage } from "@/components/ui/standardized-images";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import Link from "next/link";

// Helper function to check if breaking news is still fresh (within 1 hour)
function isBreakingNewsFresh(createdAt: string | Date): boolean {
  const now = new Date();
  const created = new Date(createdAt);
  const hoursSinceCreation = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return hoursSinceCreation <= 1; // Hide after 1 hour
}

interface FeaturedNewsProps {
  news: News[];
  title?: string;
  maxItems?: number;
  layout?: "grid" | "list";
}

function FeaturedCard({ news }: { news: News }) {
  const shouldShowBreaking = news.isBreaking && isBreakingNewsFresh(news.createdAt);

  return (
    <Link
      href={`/news/${news.slug || news.id}`}
      className="group block"
      style={{
        textDecoration: 'none',
      }}
    >
      <div 
        className="pb-4"
        style={{
          borderBottom: '1px solid #e6e6e6',
        }}
      >
        {/* Desktop: Image left, content right | Mobile: Stacked */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Image */}
          <div 
            className="relative w-full md:w-48 h-48 md:h-32 shrink-0 overflow-hidden"
            style={{
              backgroundColor: '#f0f0f0',
            }}
          >
            {news.mainImage && news.mainImage.trim() !== "" ? (
              news.mainImage.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                <div className="relative w-full h-full">
                  <video
                    src={getImageUrl(news.mainImage)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="bg-white/80 p-2">
                      <svg
                        className="w-5 h-5 text-gray-900"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <FeaturedArticleImage
                  src={getImageUrl(news.mainImage)}
                  alt={news.title}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              )
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-sm text-gray-500">Image not available</p>
              </div>
            )}
            {shouldShowBreaking && (
              <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold z-10">
                BREAKING
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Category and Breaking Badge */}
            <div className="flex items-center gap-2 mb-2">
              {shouldShowBreaking && (
                <span 
                  className="inline-block bg-red-600 text-white px-2 py-0.5 text-xs font-bold"
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  BREAKING
                </span>
              )}
              {news.category && (
                <span 
                  className="text-xs font-black text-red-600 uppercase tracking-wider"
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  {news.category.nameEn}
                </span>
              )}
            </div>

            {/* Headline */}
            <h3 
              className="line-clamp-3 mb-2"
              style={{
                fontSize: '18px',
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
              {news.title}
            </h3>

            {/* Excerpt */}
            {news.summary && (
              <p 
                className="line-clamp-2 mb-2"
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '1.5',
                  color: '#333333',
                }}
              >
                {news.summary}
              </p>
            )}

            {/* Metadata */}
            <div
              style={{
                fontSize: '12px',
                fontWeight: 400,
                color: '#6B6B6B',
                letterSpacing: '0.2px',
              }}
            >
              {formatRelativeTime(news.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedNews({ 
  news, 
  title = "FEATURED NEWS", 
  maxItems = 6,
  layout = "list"
}: FeaturedNewsProps) {
  if (!news || news.length === 0) return null;

  const displayNews = news.slice(0, maxItems);

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
          <h2 
            style={{
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: '#0A0A0A',
            }}
          >
            {title}
          </h2>
        </div>
      )}
      
      {layout === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayNews.map((story) => (
            <div key={story.id} className="border-b border-gray-200 pb-4">
              <FeaturedCard news={story} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-0">
          {displayNews.map((story) => (
            <FeaturedCard key={story.id} news={story} />
          ))}
        </div>
      )}
    </div>
  );
}
