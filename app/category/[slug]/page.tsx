import { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Link from "next/link";
import { CategoryClient } from "@/components/category/category-client";
import { fetchCategoryBySlug, fetchNews, fetchCategories } from "@/lib/api/server-api";
import { mapSEOToNextMetadata } from "@/lib/helpers/metadataMapper";
import { API_CONFIG } from "@/lib/api/apiConfig";
import { getServerLanguage } from "@/lib/i18n/server";
import { Loading } from "@/components/ui/loading";

// ISR: Revalidate category pages every 300 seconds (5 minutes)
// Categories change less frequently than news, so longer cache is acceptable
export const revalidate = 300;

// Force dynamic rendering because we use searchParams
export const dynamic = 'force-dynamic';

// Generate static params for all categories at build time
// This pre-generates category pages for faster initial load
export async function generateStaticParams() {
  try {
    const categoriesData = await fetchCategories(true);
    const categories = categoriesData?.data || [];
    
    // Return array of params for static generation
    return categories
      .filter((cat: { slug?: string }) => cat.slug)
      .map((category: { slug: string }) => ({
        slug: category.slug,
      }));
  } catch (error) {
    console.error("Failed to generate static params for categories:", error);
    // Return empty array on error - pages will be generated on-demand
    return [];
  }
}

// Generate metadata for category page (runs on server)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Always return valid metadata, even if fetching fails
  const fallbackMetadata: Metadata = {
    title: "Category | TG CALABRIA",
    description: "Browse news articles by category on TG CALABRIA",
  };

  try {
    let slug: string = "";
    try {
      const paramsData = await params;
      if (paramsData?.slug && typeof paramsData.slug === "string") {
        slug = paramsData.slug;
      }
    } catch (paramsError) {
      console.error("Failed to extract slug in generateMetadata:", paramsError);
      return fallbackMetadata;
    }

    if (!slug || slug.trim() === "") {
      return fallbackMetadata;
    }

    // Try to fetch SEO metadata
    try {
      if (API_CONFIG?.BASE_URL && API_CONFIG.BASE_URL.trim() !== "") {
        const isDev = process.env.NODE_ENV === "development";
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/seo/category/${slug}`,
          {
            next: { revalidate: isDev ? 0 : 3600 },
            headers: {
              "Content-Type": "application/json",
            },
            ...(isDev && { cache: "no-store" }),
          }
        );
        if (response.ok) {
          const seoResponse = await response.json();
          if (seoResponse?.success && seoResponse?.data) {
            try {
              return mapSEOToNextMetadata(seoResponse.data);
            } catch (mapError) {
              console.error("Failed to map SEO metadata:", mapError);
              // Continue to fallback
            }
          }
        } else if (response.status !== 404) {
          // Only log non-404 errors (404s are expected when SEO metadata doesn't exist)
          console.warn(`SEO metadata fetch returned status ${response.status} for slug "${slug}"`);
        }
      } else {
        console.warn("API_CONFIG.BASE_URL is not configured. Skipping SEO metadata fetch.");
      }
    } catch (fetchError) {
      console.error("Failed to fetch category SEO metadata:", fetchError);
      // Continue to fallback
    }
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    // Continue to fallback
  }

  // Fallback metadata with language support
  try {
    let language = "en"; // Default to English
    try {
      language = await getServerLanguage(cookies());
    } catch (langError) {
      console.error("Failed to get server language:", langError);
      // Use default "en"
    }
    return {
      title: language === "it" ? "Categoria | TG CALABRIA" : "Category | TG CALABRIA",
      description:  
        language === "it"
          ? "Sfoglia gli articoli di notizie per categoria su TG CALABRIA"
          : "Browse news articles by category on TG CALABRIA",
    };
  } catch (error) {
    // Ultimate fallback if even language detection fails
    console.error("Error in generateMetadata fallback:", error);
    return fallbackMetadata;
  }
}

// Server component - fetches data on server
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  // Initialize with safe defaults
  let slug: string = "";
  let page: number = 1;
  let category: { data: any } | null = null;
  let initialNews: any[] = [];
  let structuredData: any = null;

  try {
    // Safely extract params - don't throw, just log and use empty string
    try {
      const paramsData = await params;
      if (paramsData?.slug && typeof paramsData.slug === "string") {
        slug = paramsData.slug;
      } else {
        console.error("Invalid slug in params:", paramsData);
        slug = "";
      }
    } catch (paramsError) {
      console.error("Failed to extract params:", paramsError);
      slug = "";
    }

    // Safely extract searchParams - handle it without await to avoid dynamic error
    try {
      // Use Promise.resolve to handle searchParams safely
      const resolvedSearchParams = await Promise.resolve(searchParams);
      if (resolvedSearchParams?.page) {
        const parsedPage = Number(resolvedSearchParams.page);
        if (!isNaN(parsedPage) && parsedPage > 0) {
          page = parsedPage;
        }
      }
    } catch {
      // If searchParams causes issues, just use default page
      page = 1;
    }

    // Check if API is configured before making requests
    if (!API_CONFIG?.BASE_URL || API_CONFIG.BASE_URL.trim() === "") {
      console.warn("API_CONFIG.BASE_URL is not configured. Category data cannot be fetched.");
      console.warn("Please set NEXT_PUBLIC_API_URL environment variable.");
      // Return early with null category - CategoryClient will handle it gracefully
      category = null;
      initialNews = [];
      structuredData = null;
    } else if (slug && slug.trim() !== "") {
      // Fetch category
      try {
        category = await fetchCategoryBySlug(slug);
      } catch (categoryError) {
        console.error("Failed to fetch category by slug:", categoryError);
        category = null;
      }

      // Only fetch news and structured data if category exists
      if (category?.data?.id) {
        // Fetch news for this category
        try {
          const newsData = await fetchNews({
            categoryId: category.data.id,
            status: "PUBLISHED",
            page,
            limit: 12,
          });
          if (newsData?.success && newsData?.data?.news && Array.isArray(newsData.data.news)) {
            initialNews = newsData.data.news;
          } else {
            console.warn("News data fetch returned unsuccessful or missing data:", {
              success: newsData?.success,
              message: newsData?.message,
            });
            initialNews = [];
          }
        } catch (newsError) {
          console.error("Failed to fetch news for category:", newsError);
          // Continue with empty news array
          initialNews = [];
        }

        // Fetch structured data
        try {
          const isDev = process.env.NODE_ENV === "development";
          const response = await fetch(
            `${API_CONFIG.BASE_URL}/seo/category/${slug}/structured-data`,
            {
              next: { revalidate: isDev ? 0 : 3600 },
              headers: {
                "Content-Type": "application/json",
              },
              ...(isDev && { cache: "no-store" }),
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (data?.success && data?.data) {
              structuredData = data.data;
            }
          }
        } catch (error) {
          console.error("Failed to fetch category structured data:", error);
          // Continue without structured data
        }
      } else {
        console.warn(`Category with slug "${slug}" not found or has no ID`);
      }
    } else {
      console.warn("Category page accessed without valid slug");
      category = null;
    }
  } catch (error) {
    // Catch any unexpected errors and log them
    console.error("Critical error in CategoryPage:", error);
    // Ensure we have safe defaults - don't throw, just log
    category = null;
    initialNews = [];
    structuredData = null;
  }

  // Always return a valid component, even if data fetching failed
  // CategoryClient will handle null category gracefully
  // Wrap CategoryClient in Suspense because it uses useSearchParams()
  try {
    return (
      <Suspense fallback={
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl py-8">
          <Loading />
        </div>
      }>
        <CategoryClient
          category={category?.data || null}
          initialNews={initialNews}
          structuredData={structuredData}
        />
      </Suspense>
    );
  } catch (renderError) {
    // Catch any rendering errors and return a safe fallback
    console.error("Error rendering CategoryPage:", renderError);
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-6">
            The category you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-[#c70000] text-white rounded hover:bg-[#ff0000] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
}
