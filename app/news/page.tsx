import { Metadata } from "next";
import { fetchNews } from "@/lib/api/server-api";
import { News } from "@/types/news.types";
import { API_CONFIG } from "@/lib/api/apiConfig";
import { getServerLanguage } from "@/lib/i18n/server";
import { cookies } from "next/headers";
import { NewsListingClient } from "@/components/news/news-listing-client";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage(cookies());
  return {
    title: language === "it" ? "Tutte le Notizie | TG CALABRIA" : "All News | TG CALABRIA",
    description:
      language === "it"
        ? "Leggi tutte le ultime notizie su TG CALABRIA"
        : "Read all the latest news on TG CALABRIA",
  };
}

// Server component - fetches data on server
export default async function NewsListingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  let page: number = 1;
  let initialNews: News[] = [];

  try {
    // Safely extract searchParams
    try {
      const resolvedSearchParams = await Promise.resolve(searchParams);
      if (resolvedSearchParams?.page) {
        const parsedPage = Number(resolvedSearchParams.page);
        if (!isNaN(parsedPage) && parsedPage > 0) {
          page = parsedPage;
        }
      }
    } catch {
      page = 1;
    }

    // Check if API is configured
    if (!API_CONFIG?.BASE_URL || API_CONFIG.BASE_URL.trim() === "") {
      console.warn("API_CONFIG.BASE_URL is not configured. News data cannot be fetched.");
    } else {
      // Fetch all published news
      const newsData = await fetchNews({
        page,
        limit: 20,
        status: "PUBLISHED",
      });

      if (newsData?.success && newsData?.data?.news) {
        initialNews = newsData.data.news;
      }
    }
  } catch (error) {
    console.error("Failed to fetch news:", error);
  }

  return <NewsListingClient initialNews={initialNews} initialPage={page} />;
}
