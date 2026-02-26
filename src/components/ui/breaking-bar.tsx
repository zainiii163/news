"use client";

import React, { useState, useEffect, useRef } from "react";
import { useBreakingNews } from "@/lib/hooks/useBreakingNews";
import Link from "next/link";
import { News } from "@/types/news.types";

export function BreakingBar() {
  const { breakingNews } = useBreakingNews(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Auto-scroll headlines
  useEffect(() => {
    if (!scrollRef.current || breakingNews.length <= 1) return;

    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;
    const scrollSpeed = 1; // pixels per frame
    const scrollDelay = 50; // milliseconds between scrolls

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollContainer.scrollLeft = 0;
        scrollAmount = 0;
      } else {
        scrollAmount += scrollSpeed;
        scrollContainer.scrollLeft = scrollAmount;
      }
    };

    const interval = setInterval(scroll, scrollDelay);
    return () => clearInterval(interval);
  }, [breakingNews.length]);

  if (!breakingNews || breakingNews.length === 0) {
    return null;
  }

  return (
    <div 
      className="bg-[#CC0000] text-white relative overflow-hidden w-full"
      style={{ 
        boxShadow: 'none',
        borderRadius: '0'
      }}
    >
      <div className="flex items-center py-1">
        {/* BREAKING Label */}
        <div className="flex-shrink-0 px-4 bg-[#CC0000] z-10">
          <span 
            className="text-xs font-black uppercase tracking-wider whitespace-nowrap"
            style={{ 
              fontSize: '11px',
              letterSpacing: '0.05em',
              fontWeight: '900'
            }}
          >
            BREAKING
          </span>
        </div>
        
        {/* Scrollable Headlines */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-x-hidden scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex items-center h-full space-x-8 px-4">
            {breakingNews.map((news: News, index: number) => (
              <React.Fragment key={news.id}>
                <Link 
                  href={`/news/${news.slug || news.id}`}
                  className="text-xs font-medium hover:underline whitespace-nowrap transition-colors"
                  style={{ 
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {news.title}
                </Link>
                {index < breakingNews.length - 1 && (
                  <span 
                    className="text-white/60"
                    style={{ fontSize: '12px' }}
                  >•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
