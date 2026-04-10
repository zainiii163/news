import { fetchCategoryBySlug, fetchNews } from "@/lib/api/server-api";
import { API_CONFIG } from "@/lib/api/apiConfig";
import type { Category } from "@/types/category.types";
import type { News } from "@/types/news.types";
import type { StructuredData as StructuredDataType } from "@/types/seo.types";

export type CategoryPageLoadResult = {
  category: Category | null;
  initialNews: News[];
  structuredData: StructuredDataType | null;
};

export async function loadCategoryPageData(
  slug: string,
  page: number
): Promise<CategoryPageLoadResult> {
  let category: Category | null = null;
  let initialNews: News[] = [];
  let structuredData: StructuredDataType | null = null;

  if (!API_CONFIG?.BASE_URL || API_CONFIG.BASE_URL.trim() === "") {
    return { category: null, initialNews: [], structuredData: null };
  }

  const trimmed = slug?.trim() ?? "";
  if (!trimmed) {
    return { category: null, initialNews: [], structuredData: null };
  }

  try {
    const res = await fetchCategoryBySlug(trimmed);
    category = res?.data ?? null;
  } catch (e) {
    console.error("Failed to fetch category by slug:", e);
    category = null;
  }

  if (category?.id) {
    try {
      const newsData = await fetchNews({
        categoryId: category.id,
        status: "PUBLISHED",
        page,
        limit: 20,
      });
      if (newsData?.success && newsData?.data?.news && Array.isArray(newsData.data.news)) {
        initialNews = newsData.data.news;
      }
    } catch (e) {
      console.error("Failed to fetch news for category:", e);
      initialNews = [];
    }

    try {
      const isDev = process.env.NODE_ENV === "development";
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/seo/category/${trimmed}/structured-data`,
        {
          next: { revalidate: isDev ? 0 : 3600 },
          headers: { "Content-Type": "application/json" },
          ...(isDev && { cache: "no-store" }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data?.success && data?.data) {
          structuredData = data.data as StructuredDataType;
        }
      }
    } catch (e) {
      console.error("Failed to fetch category structured data:", e);
    }
  }

  return { category, initialNews, structuredData };
}
