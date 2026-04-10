/**
 * Category section fronts: `/categories/:slug` (preferred) and `/category/:slug` (legacy alias).
 */
export function categorySectionHref(slug: string): string {
  const s = String(slug || "").trim();
  return `/categories/${encodeURIComponent(s)}`;
}

export function categorySectionBaseFromPathname(
  pathname: string | null | undefined
): "/category" | "/categories" {
  if (pathname?.startsWith("/categories/")) return "/categories";
  return "/category";
}
