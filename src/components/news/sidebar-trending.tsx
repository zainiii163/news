"use client";

import Link from "next/link";
import { useNewsPopularity } from "@/lib/hooks/useStats";
import { useLanguage } from "@/providers/LanguageProvider";
import { Loading } from "@/components/ui/loading";
import { NewsPopularityItem } from "@/types/stats.types";

interface SidebarTrendingProps {
  excludeId?: string;
  limit?: number;
}

export function SidebarTrending({ excludeId, limit = 5 }: SidebarTrendingProps) {
  const { data, isLoading } = useNewsPopularity(limit + (excludeId ? 1 : 0));

  if (isLoading) {
    return <Loading />;
  }

  // Handle the API response structure: { success, message, data: { mostViewed, trending, recentPopular } }
  const popularityData = (data as any)?.data;
  const newsArray = Array.isArray(popularityData) 
    ? popularityData 
    : popularityData?.trending || popularityData?.mostViewed || popularityData?.recentPopular || [];

  if (!newsArray || newsArray.length === 0) {
    return null;
  }

  const trendingNews = excludeId
    ? newsArray.filter((item: any) => item.id !== excludeId).slice(0, limit)
    : newsArray.slice(0, limit);

  if (trendingNews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      {trendingNews.map((item: any, index: number) => (
        <div key={item.id} className="py-2 border-b border-gray-100 last:border-b-0">
          <div className="flex items-start gap-2">
            <span className="text-xs font-bold mt-1 flex-shrink-0" style={{ color: '#CC0000' }}>
              {index + 1}.
            </span>
            <div className="flex-1">
              <Link
                href={`/news/${item.slug || item.id}`}
                className="text-xs font-medium line-clamp-2 leading-tight hover:bg-red-50 px-1 py-0.5 rounded transition -mx-1 block"
                style={{ color: '#0A0A0A' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FEF2F2';
                  e.currentTarget.style.color = '#CC0000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#0A0A0A';
                }}
              >
                {item.title}
              </Link>
              <div className="text-xs text-gray-400 mt-1">
                {item.views} views
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
