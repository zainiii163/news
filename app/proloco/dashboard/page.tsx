"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useGetMe } from "@/lib/hooks/useAuth";
import { AuthResponse } from "@/types/user.types";
import { useRouter } from "next/navigation";
import { useNews, useCreateNews, useUpdateNews } from "@/lib/hooks/useNews";
import { NewsResponse } from "@/types/news.types";
import { CreateNewsInput, UpdateNewsInput } from "@/types/news.types";
import { useCategories } from "@/lib/hooks/useCategories";
import { CategoryResponse } from "@/types/category.types";
import { StatsCard } from "@/components/admin/stats-card";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";
import { formatDate } from "@/lib/helpers/formatDate";
import { useLanguage } from "@/providers/LanguageProvider";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";
import { NewsFormModal } from "@/components/admin/news-form-modal";
import { News } from "@/types/news.types";

export default function ProlocoDashboard() {
  const router = useRouter();
  const { user: authUser, isAuthenticated } = useAuth();
  const { data: userData, isLoading: userLoading } = useGetMe(isAuthenticated);
  const { language, setLanguage, t, formatNumber: formatNumberUtil } = useLanguage();

  const [isNewsFormOpen, setIsNewsFormOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const { showToast } = useToast();

  // News mutations
  const createMutation = useCreateNews();
  const updateMutation = useUpdateNews();

  // Get current user with allowed categories
  const currentUser = (userData as AuthResponse | undefined)?.data?.user || authUser;

  // Only show Pro Loco's allowed categories
  const allowedCategoryIds =
    (currentUser as any)?.prolocoAllowedCategories?.map((cat: any) => cat.id) || [];

  // Fetch news with all statuses to show Pro Loco's own news (DRAFT, PENDING_REVIEW, REJECTED, PUBLISHED)
  // Backend defaults to PUBLISHED if no status, so we need to fetch multiple statuses
  const { data: publishedData, isLoading: publishedLoading } = useNews({
    page: 1,
    limit: 100,
    status: "PUBLISHED",
  });
  const { data: draftData, isLoading: draftLoading } = useNews({
    page: 1,
    limit: 100,
    status: "DRAFT",
  });
  const { data: pendingData, isLoading: pendingLoading } = useNews({
    page: 1,
    limit: 100,
    status: "PENDING_REVIEW",
  });
  const { data: rejectedData, isLoading: rejectedLoading } = useNews({
    page: 1,
    limit: 100,
    status: "REJECTED",
  });

  // Combine news from all status queries
  const newsData = useMemo(() => {
    const publishedNews = (publishedData as NewsResponse | undefined)?.data?.news || [];
    const draftNews = (draftData as NewsResponse | undefined)?.data?.news || [];
    const pendingNews = (pendingData as NewsResponse | undefined)?.data?.news || [];
    const rejectedNews = (rejectedData as NewsResponse | undefined)?.data?.news || [];

    // Combine and deduplicate by ID
    const combined = [
      ...publishedNews,
      ...draftNews,
      ...pendingNews,
      ...rejectedNews,
    ];

    // Remove duplicates based on ID
    const uniqueNews = combined.filter(
      (news, index, self) => index === self.findIndex((n) => n.id === news.id)
    );

    return {
      data: {
        news: uniqueNews,
        meta: {
          total: uniqueNews.length,
          page: 1,
          limit: 100,
          totalPages: 1,
        },
      },
    } as NewsResponse;
  }, [publishedData, draftData, pendingData, rejectedData]);

  const newsLoading = publishedLoading || draftLoading || pendingLoading || rejectedLoading;

  // Refetch function - queries will auto-refetch via query invalidation in mutations
  const refetchNews = () => {
    // Queries will automatically refetch when mutations succeed
    // This is handled by React Query's query invalidation in useCreateNews/useUpdateNews
  };

  // Fetch all categories but filter to show only allowed ones
  const { data: categoriesData } = useCategories(true);
  const categoriesList = (categoriesData as CategoryResponse | undefined)?.data || [];
  const allowedCategories =
    categoriesList.filter((cat) =>
      allowedCategoryIds.includes(cat.id)
    );

  // Redirect if not authenticated or not Pro Loco
  useEffect(() => {
    if (!userLoading) {
      if (!isAuthenticated) {
        router.push("/register?type=proloco");
        return;
      }
      if (currentUser && currentUser.role !== "PROLOCO") {
        // If user is not Pro Loco, redirect based on their role
        if (currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN") {
          router.push("/admin/dashboard");
        } else if (currentUser.role === "EDITOR") {
          router.push("/editor");
        } else if (currentUser.role === "ADVERTISER") {
          router.push("/advertiser/dashboard");
        } else {
          router.push("/dashboard");
        }
        return;
      }
    }
  }, [isAuthenticated, currentUser, userLoading, router]);

  if (userLoading || newsLoading) {
    return <Loading />;
  }

  if (!isAuthenticated || currentUser?.role !== "PROLOCO") {
    return null; // Will redirect
  }

  // Check if Pro Loco is approved
  if ((currentUser as any)?.prolocoStatus !== "APPROVED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-900 mb-2">
              {t("proloco.accountPendingApproval")}
            </h2>
            <p className="text-yellow-800">
              {t("proloco.accountPendingDescription")}
            </p>
            <div className="mt-4">
              <Link
                href="/"
                className="text-yellow-900 font-medium hover:text-yellow-700"
              >
                {t("proloco.backToHome")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter news to show only those in allowed categories and created by this Pro Loco
  const newsList = (newsData as NewsResponse | undefined)?.data?.news || [];
  const userNews =
    newsList.filter(
      (news) =>
        allowedCategoryIds.includes(news.categoryId) &&
        news.authorId === currentUser?.id
    );

  // Calculate statistics
  const totalNews = userNews.length;
  const publishedNews = userNews.filter((n) => n.status === "PUBLISHED").length;
  const pendingNews = userNews.filter(
    (n) => n.status === "PENDING_REVIEW"
  ).length;
  const draftNews = userNews.filter((n) => n.status === "DRAFT").length;
  const rejectedNews = userNews.filter((n) => n.status === "REJECTED").length;

  // Get recent news (last 5)
  const recentNews = userNews
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const handleCreateNews = () => {
    setEditingNews(null);
    setIsNewsFormOpen(true);
  };

  const handleEditNews = (news: News) => {
    setEditingNews(news);
    setIsNewsFormOpen(true);
  };

  const handleNewsFormSubmit = (formData: CreateNewsInput | UpdateNewsInput) => {
    if (editingNews) {
      // Update existing news
      updateMutation.mutate(
        { id: editingNews.id, data: formData },
        {
          onSuccess: () => {
            setIsNewsFormOpen(false);
            setEditingNews(null);
            // Queries will auto-refetch via query invalidation
            showToast(
              language === "it"
                ? "Notizia aggiornata con successo"
                : "News updated successfully",
              "success"
            );
          },
          onError: (error: any) => {
            showToast(
              error?.response?.data?.message ||
                (language === "it"
                  ? "Errore durante l'aggiornamento della notizia"
                  : "Failed to update news"),
              "error"
            );
          },
        }
      );
    } else {
      // Create new news
      createMutation.mutate(formData as CreateNewsInput, {
        onSuccess: () => {
          setIsNewsFormOpen(false);
          setEditingNews(null);
          // Queries will auto-refetch via query invalidation
          showToast(
            language === "it"
              ? "Notizia creata con successo. In attesa di approvazione."
              : "News created successfully. Pending admin approval.",
            "success"
          );
        },
        onError: (error: any) => {
          showToast(
            error?.response?.data?.message ||
              (language === "it"
                ? "Errore durante la creazione della notizia"
                : "Failed to create news"),
            "error"
          );
        },
      });
    }
  };

  const handleNewsFormClose = () => {
    setIsNewsFormOpen(false);
    setEditingNews(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("proloco.dashboard")} - {(currentUser as any)?.prolocoName || currentUser?.name}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {t("proloco.city")}: {(currentUser as any)?.prolocoCity || "—"} • {t("proloco.code")}: {(currentUser as any)?.prolocoCode || "—"}
            </p>
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => setLanguage("it")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                language === "it"
                  ? "bg-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              IT
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                language === "en"
                  ? "bg-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Allowed Categories Info */}
        {allowedCategories.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-blue-900 mb-2">
              {t("proloco.allowedCategories")}:
            </h2>
            <div className="flex flex-wrap gap-2">
              {allowedCategories.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {language === "it" ? cat.nameIt : cat.nameEn}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm text-blue-700">
              {t("proloco.allowedCategoriesDescription")}
            </p>
          </div>
        )}

        {allowedCategories.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              ⚠️ {t("proloco.noCategoriesAssigned")}
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatsCard
            title={t("proloco.totalNews")}
            value={formatNumberUtil(totalNews)}
            icon="📰"
          />
          <StatsCard
            title={t("proloco.published")}
            value={formatNumberUtil(publishedNews)}
            icon="✅"
          />
          <StatsCard
            title={t("proloco.pendingReview")}
            value={formatNumberUtil(pendingNews)}
            icon="⏳"
          />
          <StatsCard
            title={t("proloco.drafts")}
            value={formatNumberUtil(draftNews)}
            icon="📝"
          />
          <StatsCard
            title={t("proloco.rejected")}
            value={formatNumberUtil(rejectedNews)}
            icon="❌"
          />
        </div>

        {/* Action Button */}
        <div className="mb-6">
          <button
            onClick={handleCreateNews}
            disabled={allowedCategories.length === 0}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            + {t("proloco.createNews")}
          </button>
        </div>

        {/* Recent News */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            {t("proloco.myRecentNews")}
          </h2>
          {recentNews.length > 0 ? (
            <div className="space-y-4">
              {recentNews.map((news) => (
                <div
                  key={news.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {news.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {news.summary}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          {t("proloco.status")}:{" "}
                          <span
                            className={`font-semibold ${
                              news.status === "PUBLISHED"
                                ? "text-green-600"
                                : news.status === "PENDING_REVIEW"
                                ? "text-yellow-600"
                                : news.status === "REJECTED"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {news.status === "PUBLISHED"
                              ? t("admin.published")
                              : news.status === "PENDING_REVIEW"
                              ? t("admin.pendingReview")
                              : news.status === "REJECTED"
                              ? t("admin.rejected")
                              : t("admin.draft")}
                          </span>
                        </span>
                        <span>•</span>
                        <span>{formatDate(news.createdAt)}</span>
                        <span>•</span>
                        <Link
                          href={`/news/${news.slug}`}
                          className="text-red-600 hover:text-red-700"
                        >
                          {t("common.view")}
                        </Link>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditNews(news)}
                      className="ml-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
                    >
                      {t("common.edit")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              {t("proloco.noNewsYet")}
            </p>
          )}
        </div>

        {/* News Form Modal */}
        {isNewsFormOpen && (
          <NewsFormModal
            news={editingNews}
            categories={allowedCategories}
            onSubmit={handleNewsFormSubmit}
            onClose={handleNewsFormClose}
            isLoading={createMutation.isPending || updateMutation.isPending}
            error={createMutation.error || updateMutation.error}
          />
        )}
      </div>
    </div>
  );
}

