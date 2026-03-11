"use client";

import { News } from "@/types/news.types";
import Link from "next/link";

interface CnnRibbonProps {
  stories: News[];
}

export function CnnRibbon({ stories }: CnnRibbonProps) {
  return (
    <div className="border-b border-gray-200 pb-4 mb-8">
      <div className="overflow-x-auto">
        <div className="flex gap-4 md:gap-5 lg:gap-12 whitespace-nowrap">
          {stories.slice(0, 8).map((story) => (
            <div key={story.id} className="flex-shrink-0">
              <Link 
                href={`/news/${story.slug || story.id}`} 
                className="group block"
              >
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition leading-tight">
                  {story.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
