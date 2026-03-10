"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface BreakingNewsTickerProps {
  headlines: Array<{
    title: string;
    url?: string;
    id: string;
  }>;
  title?: string;
  autoScroll?: boolean;
  scrollSpeed?: number;
  className?: string;
}

export function BreakingNewsTicker({ 
  headlines, 
  title = "BREAKING NEWS",
  autoScroll = true,
  scrollSpeed = 50,
  className = ""
}: BreakingNewsTickerProps) {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoScroll || !tickerRef.current) return;

    const ticker = tickerRef.current;
    const scrollContent = ticker.querySelector('[data-scroll-content]');
    
    if (!scrollContent) return;

    let scrollPosition = 0;
    const scroll = () => {
      if (!ticker || !scrollContent) return;
      
      scrollPosition += 1;
      
      // Reset when content scrolls out of view
      if (scrollPosition >= scrollContent.scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      ticker.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, scrollSpeed);
    
    return () => clearInterval(intervalId);
  }, [autoScroll, scrollSpeed]);

  if (!headlines || headlines.length === 0) return null;

  return (
    <div className={`bg-red-600 text-white overflow-hidden ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl w-full">
        <div className="flex items-center gap-4 py-2 overflow-x-auto whitespace-nowrap">
          {/* Breaking News Label */}
          <span 
            className="text-xs font-black text-white uppercase tracking-wider flex-shrink-0"
            style={{
              fontSize: '12px',
              fontWeight: 900,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </span>
          
          {/* Scrolling Headlines */}
          <div 
            ref={tickerRef}
            className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide"
            style={{
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            <div 
              data-scroll-content
              className="flex gap-4"
              style={{
                display: 'inline-flex',
                willChange: 'transform',
              }}
            >
              {/* Duplicate headlines for seamless scrolling */}
              {[...headlines, ...headlines].map((headline, index) => (
                <div key={`${headline.id}-${index}`} className="flex items-center gap-4 flex-shrink-0">
                  <Link
                    href={headline.url || `/news/${headline.id}`}
                    className="text-sm font-bold text-white hover:text-gray-200 transition-colors block"
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      transition: 'color 0.15s ease',
                    }}
                  >
                    {headline.title}
                  </Link>
                  
                  {/* Separator Dot */}
                  <span 
                    className="text-red-200 flex-shrink-0"
                    style={{
                      fontSize: '16px',
                      lineHeight: '1',
                    }}
                  >
                    •
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
