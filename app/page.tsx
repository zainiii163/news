import { Metadata } from "next";
import { cookies } from "next/headers";
import { fetchNews, fetchHomepageLayout } from "@/lib/api/server-api";
import { seoApi } from "@/lib/api/modules/seo.api";
import { News } from "@/types/news.types";
import { HomepageSection } from "@/lib/api/modules/homepage.api";
import { mapSEOToNextMetadata } from "@/lib/helpers/metadataMapper";
import { HomeClient } from "@/components/home/home-client";
import { API_CONFIG } from "@/lib/api/apiConfig";
import { getServerLanguage } from "@/lib/i18n/server";
import { getDefaultMetadata } from "@/lib/i18n/metadata";

// ISR: Revalidate homepage every 60 seconds
// This allows the page to be statically generated and cached, but refreshed periodically
export const revalidate = 60;

// Generate metadata for homepage (runs on server)
export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage(cookies());

  try {
    const response = await seoApi.getHomepageSEO();
    if (response.success && response.data?.data) {
      return mapSEOToNextMetadata(response.data.data);
    }
  } catch (error) {
    console.error("Failed to fetch homepage SEO metadata:", error);
  }

  // Fallback metadata with language support
  return getDefaultMetadata(language);
}

// Server component - fetches data on server
export default async function Home() {
  // Fetch news data on server
  let allNews: News[] = [];
  let structuredData = null;
  let homepageSections: HomepageSection[] = [];

  try {
    // Check if API URL is configured
    if (!API_CONFIG.BASE_URL) {
      console.error("API_CONFIG.BASE_URL is not set. Please configure NEXT_PUBLIC_API_URL environment variable.");
      console.error("Current NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
    }

    const newsData = await fetchNews({
      limit: 50,
      status: "PUBLISHED",
    });

    if (newsData?.success && newsData?.data?.news) {
      allNews = newsData.data.news;
    } else {
      console.warn("News data fetch returned unsuccessful or missing data:", {
        success: newsData?.success,
        message: newsData?.message,
        hasData: !!newsData?.data,
      });
    }

    // Fetch homepage layout
    try {
      const layoutData = await fetchHomepageLayout();
      if (layoutData?.success && layoutData.data) {
        homepageSections = layoutData.data as unknown as HomepageSection[];
      }
    } catch (error) {
      console.error("Failed to fetch homepage layout:", error);
    }

    // Fetch structured data
    try {
      const isDev = process.env.NODE_ENV === "development";
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/seo/homepage/structured-data`,
        {
          next: { revalidate: isDev ? 0 : 3600 }, // No cache in dev, 1h in production
          ...(isDev && { cache: "no-store" }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          structuredData = data.data;
        }
      }
    } catch (error) {
      console.error("Failed to fetch homepage structured data:", error);
    }
  } catch (error) {
    console.error("Failed to fetch news:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    // Return empty array on error - client component will handle error display
  }

  // Pass data to client component
  return (
    <HomeClient
      allNews={allNews}
      structuredData={structuredData}
      sections={homepageSections}
    />
  );
}
