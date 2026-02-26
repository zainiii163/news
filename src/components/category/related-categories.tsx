"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCategories } from "@/lib/hooks/useCategories";
import { useLanguage } from "@/providers/LanguageProvider";
import { Loading } from "@/components/ui/loading";
import { Category } from "@/types/category.types";
import { getRootCategories } from "@/lib/helpers/category-helpers";

interface RelatedCategoriesProps {
  currentCategoryId: string;
  currentCategoryParentId?: string | null;
  className?: string;
}

export function RelatedCategories({
  currentCategoryId,
  currentCategoryParentId,
  className = "",
}: RelatedCategoriesProps) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const { data: categoriesData, isLoading } = useCategories(true);

  if (isLoading) {
    return (
      <div 
        className={className}
        style={{ 
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          borderLeft: '1px solid #e6e6e6',
          paddingLeft: '16px',
          backgroundColor: '#ffffff',
        }}
      >
        <h3 
          className="mb-4 pb-3"
          style={{
            borderBottom: '1px solid #e6e6e6',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            color: '#0A0A0A',
          }}
        >
          {language === "it" ? "Categorie" : "Categories"}
        </h3>
        <Loading />
      </div>
    );
  }

  if (!categoriesData?.data) {
    return null;
  }

  // Ensure categoriesData.data.data is an array
  const categoriesArray = Array.isArray(categoriesData.data.data) 
    ? categoriesData.data.data 
    : [];

  if (categoriesArray.length === 0) {
    return null;
  }

  // Flatten categories
  const flattenCategories = (cats: Category[]): Category[] => {
    if (!Array.isArray(cats)) {
      return [];
    }
    const result: Category[] = [];
    for (const cat of cats) {
      result.push(cat);
      if (cat.children && cat.children.length > 0) {
        result.push(...flattenCategories(cat.children));
      }
    }
    return result;
  };

  const allCategories = flattenCategories(categoriesArray);

  // Get all root categories for the sidebar (CNN style - shows all main categories)
  const rootCategories = getRootCategories(categoriesArray);
  
  // Sort by order
  const sortedRootCategories = [...rootCategories].sort((a, b) => a.order - b.order);

  // Show all root categories (including current if it's a root category)
  const displayCategories = sortedRootCategories;

  if (displayCategories.length === 0) {
    return null;
  }
  
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .cnn-sidebar-container li,
        .cnn-sidebar-container li a,
        .cnn-sidebar-container li:hover,
        .cnn-sidebar-container li:hover a,
        .cnn-sidebar-container li:active,
        .cnn-sidebar-container li:active a,
        .cnn-sidebar-container li:focus,
        .cnn-sidebar-container li:focus a {
          background-color: transparent !important;
          background: transparent !important;
          background-image: none !important;
        }
        .cnn-sidebar-container li:hover a {
          color: #CC0000 !important;
        }
        .cnn-sidebar-container li[data-active="true"] a {
          color: #CC0000 !important;
        }
      `}} />
      <div 
        className={className}
        style={{ 
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          borderLeft: '1px solid #e6e6e6',
          paddingLeft: '16px',
          backgroundColor: '#ffffff',
        }}
      >
        <h3 
          className="mb-4 pb-3"
          style={{
            borderBottom: '1px solid #e6e6e6',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            color: '#0A0A0A',
          }}
        >
          {language === "it" ? "Categorie" : "Categories"}
        </h3>
      <ul className="cnn-sidebar-container" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {displayCategories.map((category, index) => {
          const categoryPath = `/category/${category.slug}`;
          const isActive = pathname === categoryPath || pathname.startsWith(categoryPath + '/');
          const categoryName = language === "it" ? category.nameIt : category.nameEn;
          
          return (
            <li 
              key={category.id}
              data-active={isActive}
              style={{
                borderBottom: index < displayCategories.length - 1 ? '1px solid #f0f0f0' : 'none',
                listStyle: 'none',
                backgroundColor: 'transparent',
              }}
            >
              <Link
                href={categoryPath}
                className="cnn-sidebar-link"
                style={{
                  display: 'block',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '1.5',
                  color: isActive ? '#CC0000' : '#0A0A0A',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                  backgroundColor: 'transparent',
                  background: 'transparent',
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  if (!isActive) {
                    target.style.color = '#CC0000';
                  }
                  target.style.backgroundColor = 'transparent';
                  target.style.background = 'transparent';
                  target.style.setProperty('background-color', 'transparent', 'important');
                  target.style.setProperty('background', 'transparent', 'important');
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.color = isActive ? '#CC0000' : '#0A0A0A';
                  target.style.backgroundColor = 'transparent';
                  target.style.background = 'transparent';
                  target.style.setProperty('background-color', 'transparent', 'important');
                  target.style.setProperty('background', 'transparent', 'important');
                }}
              >
                {categoryName}
              </Link>
            </li>
          );
        })}
      </ul>
      </div>
    </>
  );
}

