"use client";

import { News } from "@/types/news.types";
import { formatRelativeTime } from "@/lib/helpers/formatDate";
import Link from "next/link";

interface TextNewsLinkProps {
  story: News;
  showCategory?: boolean;
  showBullet?: boolean;
  size?: "small" | "medium" | "large";
}

export function TextNewsLink({ 
  story, 
  showCategory = false,
  showBullet = false,
  size = "medium"
}: TextNewsLinkProps) {
  const sizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base"
  };

  return (
    <Link
      href={`/news/${story.slug || story.id}`}
      className="group block"
    >
      <div className="flex items-start gap-2">
        {showBullet && (
          <span className="text-red-600 font-bold mt-1">•</span>
        )}
        
        <div className="flex-1 min-w-0">
          {showCategory && story.category && (
            <span className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1 block">
              {story.category.nameEn || story.category.nameIt}
            </span>
          )}
          
          <h3 className={`${sizeClasses[size]} font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-3 leading-tight`}>
            {story.title}
          </h3>
          
          <p className="text-xs text-gray-500 mt-1">
            {formatRelativeTime(story.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
