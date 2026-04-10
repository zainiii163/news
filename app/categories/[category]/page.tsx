import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { CategoryClient } from "@/components/category/category-client";
import { fetchCategories } from "@/lib/api/server-api";
import { API_CONFIG } from "@/lib/api/apiConfig";
import { Loading } from "@/components/ui/loading";
import { loadCategoryPageData } from "@/lib/pages/load-category-page-data";
import { resolveCategoryPageMetadata } from "@/lib/pages/category-page-metadata";

export const revalidate = 300;
export const dynamic = "force-dynamic";

/** Same slugs as `/category/[slug]` — plural route is a first-class alias. */
export async function generateStaticParams() {
  try {
    const categoriesData = await fetchCategories(true);
    const categories = categoriesData?.data || [];
    return categories
      .filter((cat: { slug?: string }) => cat.slug)
      .map((c: { slug: string }) => ({
        category: c.slug,
      }));
  } catch (error) {
    console.error("Failed to generate static params for /categories:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const fallbackMetadata: Metadata = {
    title: "Category | TG CALABRIA",
    description: "Browse news articles by category on TG CALABRIA",
  };

  try {
    const paramsData = await params;
    const slug =
      paramsData?.category && typeof paramsData.category === "string"
        ? paramsData.category
        : "";
    if (!slug.trim()) {
      return fallbackMetadata;
    }
    return await resolveCategoryPageMetadata(slug);
  } catch (paramsError) {
    console.error("Failed to extract category in generateMetadata:", paramsError);
    return fallbackMetadata;
  }
}

export default async function CategoriesSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  let slug = "";
  let page = 1;

  try {
    try {
      const paramsData = await params;
      if (paramsData?.category && typeof paramsData.category === "string") {
        slug = paramsData.category;
      } else {
        console.error("Invalid category param:", paramsData);
        slug = "";
      }
    } catch (paramsError) {
      console.error("Failed to extract params:", paramsError);
      slug = "";
    }

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

    if (!API_CONFIG?.BASE_URL || API_CONFIG.BASE_URL.trim() === "") {
      console.warn("API_CONFIG.BASE_URL is not configured. Category data cannot be fetched.");
    }
  } catch (error) {
    console.error("Critical error in CategoriesSectionPage:", error);
  }

  const { category, initialNews, structuredData } =
    slug.trim() !== "" && API_CONFIG?.BASE_URL?.trim()
      ? await loadCategoryPageData(slug, page)
      : { category: null, initialNews: [], structuredData: null };

  try {
    return (
      <Suspense
        fallback={
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl py-8">
            <Loading />
          </div>
        }
      >
        <CategoryClient
          category={category}
          initialNews={initialNews}
          structuredData={structuredData}
        />
      </Suspense>
    );
  } catch (renderError) {
    console.error("Error rendering CategoriesSectionPage:", renderError);
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
