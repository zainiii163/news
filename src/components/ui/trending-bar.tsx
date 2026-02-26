"use client";

import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";
import { News } from "@/types/news.types";
import { useNews } from "@/lib/hooks/useNews";

interface TrendingBarProps {
  trendingNews?: News[];
}

export function TrendingBar({ trendingNews: initialTrendingNews = [] }: TrendingBarProps) {
  const { language } = useLanguage();

  // Fetch breaking news with auto-refresh every 60 seconds
  const { data: breakingNewsData } = useNews({
    status: "PUBLISHED",
    limit: 10,
    refetchInterval: 60000, // 60 seconds
  });

  // Get breaking news from API or use initial prop
  // Ensure we always work with arrays
  const newsArray = Array.isArray(breakingNewsData?.data?.data?.news) 
    ? breakingNewsData.data.data.news 
    : [];
  const allBreakingNews = Array.isArray(newsArray) 
    ? newsArray.filter((n: News) => n && typeof n === 'object' && 'isBreaking' in n && n.isBreaking) 
    : [];
  
  const safeInitialTrendingNews = Array.isArray(initialTrendingNews) ? initialTrendingNews : [];
  const trendingNews = safeInitialTrendingNews.length > 0 
    ? safeInitialTrendingNews 
    : allBreakingNews.length > 0
    ? allBreakingNews
    : (Array.isArray(newsArray) ? newsArray.slice(0, 7) : []);

  // Use actual trending news from backend, or show most recent breaking news
  // Limit to 5 items for better mobile experience
  const safeTrendingNews = Array.isArray(trendingNews) ? trendingNews : [];
  const items = safeTrendingNews.length > 0 
    ? safeTrendingNews.slice(0, 5).map((news: News) => {
        if (!news || typeof news !== 'object' || !('id' in news)) return null;
        return {
          id: news.id,
          title: news.title || '',
          slug: news.slug || news.id,
        };
      }).filter((item): item is { id: string; title: string; slug: string } => item !== null)
    : [];

  if (items.length === 0) return null;

  return (
    <div className="bg-red-600 text-white overflow-hidden border-b border-red-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl w-full">
        <div className="flex items-center gap-4 py-2 overflow-x-auto scrollbar-hide scroll-smooth w-full">
          <span className="text-xs font-black text-white uppercase whitespace-nowrap flex-shrink-0">
            {language === "it" ? "ULTIME NOTIZIE" : "BREAKING NEWS"}
          </span>
          <div className="flex items-center gap-4 flex-shrink-0 min-w-max">
            {items.map((item: { id: string; title: string; slug: string }, index: number) => (
              <div key={item.id} className="flex items-center gap-4 flex-shrink-0">
                <Link
                  href={`/news/${item.slug || item.id}`}
                  className="text-sm font-bold text-white hover:text-gray-200 transition whitespace-nowrap block flex-shrink-0"
                  title={item.title}
                >
                  {item.title}
                </Link>
                {index < items.length - 1 && (
                  <span className="text-red-200 flex-shrink-0">•</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .scrollbar-hide {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </div>
  );
}
