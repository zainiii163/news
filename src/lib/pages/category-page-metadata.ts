import type { Metadata } from "next";
import { mapSEOToNextMetadata } from "@/lib/helpers/metadataMapper";
import { API_CONFIG } from "@/lib/api/apiConfig";

const fallbackMetadata: Metadata = {
  title: "Category | TG CALABRIA",
  description: "Browse news articles by category on TG CALABRIA",
};

export async function resolveCategoryPageMetadata(slug: string): Promise<Metadata> {
  if (!slug?.trim()) {
    return fallbackMetadata;
  }

  try {
    if (API_CONFIG?.BASE_URL && API_CONFIG.BASE_URL.trim() !== "") {
      const isDev = process.env.NODE_ENV === "development";
      const response = await fetch(`${API_CONFIG.BASE_URL}/seo/category/${slug}`, {
        next: { revalidate: isDev ? 0 : 3600 },
        headers: { "Content-Type": "application/json" },
        ...(isDev && { cache: "no-store" }),
      });
      if (response.ok) {
        const seoResponse = await response.json();
        if (seoResponse?.success && seoResponse?.data) {
          try {
            return mapSEOToNextMetadata(seoResponse.data);
          } catch (mapError) {
            console.error("Failed to map SEO metadata:", mapError);
          }
        }
      } else if (response.status !== 404) {
        console.warn(`SEO metadata fetch returned status ${response.status} for slug "${slug}"`);
      }
    }
  } catch (fetchError) {
    console.error("Failed to fetch category SEO metadata:", fetchError);
  }

  return fallbackMetadata;
}
