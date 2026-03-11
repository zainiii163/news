"use client";

import Link from "next/link";
import { News } from "@/types/news.types";

interface SidebarListItemProps {
  item: News | any;
  index: number;
  showSponsored?: boolean;
  sponsoredLabel?: string;
}

export function SidebarListItem({ item, index, showSponsored = false, sponsoredLabel }: SidebarListItemProps) {
  return (
    <div className="py-2 border-b border-gray-100 last:border-b-0">
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
          {showSponsored && (
            <div className="text-xs text-gray-400 mt-1">
              {sponsoredLabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
