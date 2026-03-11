"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";
import { usePathname } from "next/navigation";
import { isActiveRoute } from "@/lib/helpers/navbar-helpers";
import { getSubcategories } from "@/lib/helpers/category-helpers";
import { Category } from "@/types/category.types";

interface CategoryDropdownProps {
  category: Category;
  allCategories: Category[];
  onClose: () => void;
}

export function CategoryDropdown({
  category,
  allCategories,
  onClose,
}: CategoryDropdownProps) {
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(
    null
  );
  const [hoveredChild, setHoveredChild] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const subcategories = getSubcategories(category.id, allCategories);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleMouseEnter = () => {
    // Clear any pending timeouts when mouse enters dropdown
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    // Don't close immediately - let parent handle it
    // This prevents premature closing when moving between dropdown sections
    // The parent component will handle closing when mouse leaves the entire dropdown area
  };

  const categoryPath = `/category/${category.slug}`;

  // Get direct children (level 1) - categories that have this category as direct parent
  const directChildren = subcategories.filter(
    (cat) => cat.parentId === category.id
  );

  // If no direct children, don't show dropdown
  if (directChildren.length === 0) {
    return null;
  }


  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 w-full bg-white border-t border-gray-200 shadow-none rounded-none"
      style={{ zIndex: 1000 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseEnter}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8">
        {directChildren.map((subcategory) => {
          const subcategoryName =
            language === "it" ? subcategory.nameIt : subcategory.nameEn;
          const subcategoryPath = `/category/${subcategory.slug}`;
          const isSubcategoryActive = isActiveRoute(pathname, subcategoryPath);
          const subcategoryChildren = getSubcategories(
            subcategory.id,
            allCategories
          );
          const hasChildren = subcategoryChildren.length > 0;

          return (
            <div key={subcategory.id} className="space-y-2">
              {/* Category Title */}
              <div className="font-bold text-sm uppercase mb-3 text-gray-900">
                {subcategoryName}
              </div>
              
              {/* Child Links */}
              {hasChildren && (
                <div className="space-y-2">
                  {subcategoryChildren.map((child) => {
                    const childName =
                      language === "it" ? child.nameIt : child.nameEn;
                    const childPath = `/category/${child.slug}`;
                    const isChildActive = isActiveRoute(pathname, childPath);
                    
                    return (
                      <Link
                        key={child.id}
                        href={childPath}
                        onClick={onClose}
                        className={`text-sm text-gray-700 hover:text-red-600 hover:bg-gray-50 transition duration-150 block ${
                          isChildActive
                            ? "text-red-600 font-semibold"
                            : ""
                        }`}
                      >
                        {childName}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* View All Link - Footer */}
      <div className="border-t border-gray-200 px-8 py-4">
        <Link
          href={categoryPath}
          onClick={onClose}
          className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors inline-flex items-center"
        >
          {t("nav.viewAll")}
          <svg
            className="w-3 h-3 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
