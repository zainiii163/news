"use client";

import { useMemo } from "react";
import { useCategories } from "@/lib/hooks/useCategories";
import { Category, CategoryResponse } from "@/types/category.types";
import { ApiResponse } from "@/types/api.types";
import {
  categoriesFromApiResponse,
  flattenCategories,
  getRootCategories,
} from "@/lib/helpers/category-helpers";
import { categorySectionHref } from "@/lib/helpers/category-routes";

export type NavCategoryLink = {
  id: string;
  nameEn: string;
  nameIt: string;
  slug: string;
  href: string;
};

/** Static fallback used only when API categories are unavailable. */
export const FALLBACK_NAV_LINKS: NavCategoryLink[] = [
  { id: "fb-world", nameEn: "World", nameIt: "Mondo", slug: "world", href: categorySectionHref("world") },
  { id: "fb-politics", nameEn: "Politics", nameIt: "Politica", slug: "politics", href: categorySectionHref("politics") },
  { id: "fb-business", nameEn: "Business", nameIt: "Economia", slug: "business", href: categorySectionHref("business") },
  { id: "fb-health", nameEn: "Health", nameIt: "Salute", slug: "health", href: categorySectionHref("health") },
  { id: "fb-sport", nameEn: "Sports", nameIt: "Sport", slug: "sport", href: categorySectionHref("sport") },
];

/**
 * Fixed app routes (not `/categories/...` section fronts) listed under “More” and in the mobile drawer.
 * Add or remove entries here as you ship new pages.
 */
export const MORE_MENU_PAGE_LINKS: NavCategoryLink[] = [
  { id: "nav-pg-weather", nameEn: "Weather", nameIt: "Meteo", slug: "page-weather", href: "/weather" },
  { id: "nav-pg-sports", nameEn: "Sports", nameIt: "Sport", slug: "page-sports", href: "/sports" },
  { id: "nav-pg-transport", nameEn: "Transport", nameIt: "Trasporti", slug: "page-transport", href: "/transport" },
  { id: "nav-pg-tg", nameEn: "TG Calabria TV", nameIt: "TG Calabria TV", slug: "page-tg", href: "/tg" },
  { id: "nav-pg-horoscope", nameEn: "Horoscope", nameIt: "Oroscopo", slug: "page-horoscope", href: "/horoscope" },
  { id: "nav-pg-newsletters", nameEn: "Newsletters", nameIt: "Newsletter", slug: "page-newsletters", href: "/newsletters" },
  { id: "nav-pg-about", nameEn: "About", nameIt: "Chi siamo", slug: "page-about", href: "/about" },
  { id: "nav-pg-privacy", nameEn: "Privacy", nameIt: "Privacy", slug: "page-privacy", href: "/privacy" },
  { id: "nav-pg-terms", nameEn: "Terms of use", nameIt: "Termini di utilizzo", slug: "page-terms", href: "/terms" },
  { id: "nav-pg-accessibility", nameEn: "Accessibility", nameIt: "Accessibilità", slug: "page-accessibility", href: "/accessibility" },
];

function toNavLink(c: Category): NavCategoryLink {
  const slug = (c.slug || "").trim();
  return {
    id: c.id,
    nameEn: c.nameEn?.trim() || slug,
    nameIt: c.nameIt?.trim() || c.nameEn?.trim() || slug,
    slug,
    href: categorySectionHref(slug),
  };
}

const emptySubs: NavCategoryLink[] = [];

/**
 * Root categories from the admin/API (ordered by `order`).
 * Subcategories (`parentId` set) go to the “More” menu with overflow roots.
 * Editorial routes come from `MORE_MENU_PAGE_LINKS` (see `pageLinks`).
 */
export function useNavCategoryLinks() {
  const { data, isLoading, isError } = useCategories(false);

  const { items, subcategoryLinks, allItems } = useMemo(() => {
    const raw = categoriesFromApiResponse(data as ApiResponse<CategoryResponse>);
    if (!raw.length) {
      return {
        items: FALLBACK_NAV_LINKS,
        subcategoryLinks: emptySubs,
        allItems: [...FALLBACK_NAV_LINKS, ...MORE_MENU_PAGE_LINKS],
      };
    }

    let roots = getRootCategories(raw);
    if (!roots.length) {
      const flatRoots = flattenCategories(raw);
      roots = flatRoots.filter((c) => c && !c.parentId);
    }

    const sorted = [...roots].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const withSlug = sorted.filter((c) => c.slug?.trim());
    if (!withSlug.length) {
      return {
        items: FALLBACK_NAV_LINKS,
        subcategoryLinks: emptySubs,
        allItems: [...FALLBACK_NAV_LINKS, ...MORE_MENU_PAGE_LINKS],
      };
    }

    const bySlug = new Map<string, Category>();
    withSlug.forEach((c) => {
      const slug = c.slug.trim().toLowerCase();
      if (!bySlug.has(slug)) {
        bySlug.set(slug, c);
      }
    });

    const rootCategories = Array.from(bySlug.values());
    const rootLinks = rootCategories.map(toNavLink);
    const rootSlugSet = new Set(rootLinks.map((l) => l.slug.toLowerCase()));

    const flat = flattenCategories(raw);
    const subCandidates = flat.filter(
      (c) => c && c.parentId && String(c.slug || "").trim()
    );
    const subBySlug = new Map<string, Category>();
    for (const c of subCandidates) {
      const slug = c.slug.trim().toLowerCase();
      if (rootSlugSet.has(slug) || subBySlug.has(slug)) continue;
      subBySlug.set(slug, c);
    }
    const apiSubLinks = [...subBySlug.values()]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(toNavLink);

    return {
      items: rootLinks,
      subcategoryLinks: apiSubLinks,
      allItems: [...rootLinks, ...apiSubLinks, ...MORE_MENU_PAGE_LINKS],
    };
  }, [data]);

  return {
    items,
    subcategoryLinks,
    pageLinks: MORE_MENU_PAGE_LINKS,
    allItems,
    isLoading,
    isError,
  };
}
