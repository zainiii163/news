"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { News } from "@/types/news.types";
import { formatRelativeTime } from "@/lib/helpers/formatDate";

interface BreakingNewsTickerProps {
  breakingNews?: News[];
}

export function BreakingNewsTicker({ breakingNews = [] }: BreakingNewsTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (breakingNews.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [breakingNews.length, isPaused]);

  if (!breakingNews || breakingNews.length === 0) {
    return null;
  }

  const currentStory = breakingNews[currentIndex];

  return (
    <div 
      className="bg-red-600 text-white overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="cnn-container flex items-center h-8">
        {/* BREAKING NEWS label */}
        <div className="bg-black px-3 py-1 text-xs font-black uppercase tracking-wider whitespace-nowrap">
          BREAKING NEWS
        </div>
        
        {/* Ticker content */}
        <div className="flex-1 overflow-hidden px-4">
          <div className="flex items-center gap-4">
            {/* Current story */}
            <Link 
              href={`/news/${currentStory.slug || currentStory.id}`}
              className="hover:underline transition-all duration-300"
            >
              <span className="text-sm font-medium">
                {currentStory.title}
              </span>
            </Link>
            
            {/* Timestamp */}
            <span className="text-xs opacity-75 whitespace-nowrap">
              {formatRelativeTime(currentStory.createdAt)}
            </span>
          </div>
        </div>

        {/* Navigation dots */}
        {breakingNews.length > 1 && (
          <div className="flex items-center gap-1 px-2">
            {breakingNews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to breaking news ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
