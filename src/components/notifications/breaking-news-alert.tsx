"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { News } from "@/types/news.types";
import { useLanguage } from "@/providers/LanguageProvider";

interface BreakingNewsAlertProps {
  news: News;
  onDismiss: () => void;
  autoDismiss?: boolean;
  dismissAfter?: number; // milliseconds
}

export function BreakingNewsAlert({
  news,
  onDismiss,
  autoDismiss = true,
  dismissAfter = 10000,
}: BreakingNewsAlertProps) {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss && dismissAfter > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Wait for animation
      }, dismissAfter);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissAfter, onDismiss]);

  if (!isVisible) return null;

  return (
    <div
      className="bg-red-600 text-white py-2 px-4 w-full overflow-hidden"
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-4 w-full">
        <div className="flex items-center gap-1 sm:gap-3 flex-1 min-w-0 overflow-hidden">
          <div className="flex-shrink-0">
            <span className="font-semibold text-sm uppercase tracking-wider whitespace-nowrap">
              {language === "it" ? "ULTIM'ORA" : "BREAKING"}
            </span>
          </div>
          <Link
            href={`/news/${news.slug || news.id}`}
            className="flex-1 min-w-0 hover:underline overflow-hidden pr-1 sm:pr-0"
            onClick={onDismiss}
          >
            <span className="font-semibold text-sm line-clamp-2 break-words block overflow-hidden">
              {news.title}
            </span>
          </Link>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="flex-shrink-0 text-white hover:text-gray-200 transition p-0.5 sm:p-2"
          aria-label={language === "it" ? "Chiudi" : "Close"}
        >
          <svg
            className="w-3.5 h-3.5 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

