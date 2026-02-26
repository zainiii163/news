"use client";

import { useState, useMemo } from "react";
import {
  useNews,
  useCreateNews,
  useUpdateNews,
  useDeleteNews,
} from "@/lib/hooks/useNews";
import { useCategories } from "@/lib/hooks/useCategories";
import { usePostToSocial } from "@/lib/hooks/useSocial";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";
import { NewsFormModal } from "@/components/admin/news-form-modal";
import { NewsPreviewModal } from "@/components/admin/news-preview-modal";
import { DeleteConfirmModal } from "@/components/admin/delete-confirm-modal";
import { SocialPostResults } from "@/components/admin/social-post-results";
import {
  News,
  CreateNewsInput,
  UpdateNewsInput,
  NewsResponse,
} from "@/types/news.types";
import { CategoryResponse } from "@/types/category.types";
import { SocialPlatform, SocialPostLog } from "@/types/social.types";
import { formatDate } from "@/lib/helpers/formatDate";
import { useToast } from "@/components/ui/toast";
import { InputWithClear } from "@/components/ui/input-with-clear";
import { ClearFilterButton } from "@/components/ui/clear-filter-button";
import { useLanguage } from "@/providers/LanguageProvider";
import { newsApi } from "@/lib/api/modules/news.api";
import Link from "next/link";

type NewsStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "ARCHIVED"
  | "REJECTED";

export default function AdminNewsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [deletingNews, setDeletingNews] = useState<News | null>(null);
  const [previewNews, setPreviewNews] = useState<News | null>(null);
  const [pendingSocialPost, setPendingSocialPost] = useState<{
    platforms: SocialPlatform[];
    scheduledFor?: string;
  } | null>(null);
  const [socialPostResults, setSocialPostResults] = useState<
    SocialPostLog[] | null
  >(null);
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useToast();
  const { t, language } = useLanguage();

  const limit = 10;

  // Fetch news with filters
  const { data, isLoading, error } = useNews({
    page,
    limit,
    search: search || undefined,
    status: statusFilter || undefined,
    categoryId: categoryFilter || undefined,
  });

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useCategories(true);

  const createMutation = useCreateNews();
  const updateMutation = useUpdateNews();
  const deleteMutation = useDeleteNews();
  const postToSocialMutation = usePostToSocial();

  const newsList = (data as NewsResponse | undefined)?.data?.news || [];
  const meta = (data as NewsResponse | undefined)?.data?.meta;

  const handleCreate = () => {
    setEditingNews(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (news: News) => {
    setEditingNews(news);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (news: News) => {
    setDeletingNews(news);
  };

  const confirmDelete = () => {
    if (deletingNews) {
      deleteMutation.mutate(deletingNews.id, {
        onSuccess: () => {
          setDeletingNews(null);
        },
      });
    }
  };

  const handleSocialPost = (
    _newsId: string,
    platforms: SocialPlatform[],
    scheduledFor?: string
  ) => {
    // Store platforms and scheduled time to use after news creation/update (newsId will be available then)
    setPendingSocialPost({ platforms, scheduledFor });
  };

  const handleSubmit = (formData: CreateNewsInput | UpdateNewsInput) => {
    if (editingNews) {
      updateMutation.mutate(
        { id: editingNews.id, data: formData },
        {
          onSuccess: (response) => {
            setIsCreateModalOpen(false);
            setEditingNews(null);
            // Post to social if requested
            if (
              pendingSocialPost &&
              response &&
              "data" in response &&
              response.data &&
              typeof response.data === "object" &&
              "id" in response.data
            ) {
              postToSocialMutation.mutate(
                {
                  newsId: String(response.data.id),
                  platforms: pendingSocialPost.platforms,
                  scheduledFor: pendingSocialPost.scheduledFor,
                },
                {
                  onSuccess: (result) => {
                    const results = result?.data?.data || [];
                    setSocialPostResults(results);
                    setPendingSocialPost(null);

                    const successCount = results.filter(
                      (r) => r.status === "SUCCESS"
                    ).length;
                    const failureCount = results.filter(
                      (r) => r.status === "FAILED"
                    ).length;

                    if (successCount > 0 && failureCount === 0) {
                      showToast(
                        t("toast.successfullyPosted").replace(
                          "{count}",
                          String(successCount)
                        ),
                        "success"
                      );
                    } else if (successCount > 0 && failureCount > 0) {
                      showToast(
                        t("toast.postedWithFailures")
                          .replace("{success}", String(successCount))
                          .replace("{failures}", String(failureCount)),
                        "warning"
                      );
                    } else {
                      showToast(t("toast.failedToPost"), "error");
                    }
                  },
                  onError: (error: any) => {
                    setPendingSocialPost(null);
                    showToast(
                      error?.response?.data?.message || t("toast.failedToPost"),
                      "error"
                    );
                  },
                }
              );
            }
          },
        }
      );
    } else {
      createMutation.mutate(formData as CreateNewsInput, {
        onSuccess: (response) => {
          setIsCreateModalOpen(false);
          // Post to social if requested
          if (
            pendingSocialPost &&
            response &&
            "data" in response &&
            response.data &&
            typeof response.data === "object" &&
            "id" in response.data
          ) {
            postToSocialMutation.mutate(
              {
                newsId: String(response.data.id),
                platforms: pendingSocialPost.platforms,
                scheduledFor: pendingSocialPost.scheduledFor,
              },
              {
                onSuccess: (result) => {
                  const results = result?.data?.data || [];
                  setSocialPostResults(results);
                  setPendingSocialPost(null);

                  const successCount = results.filter(
                    (r) => r.status === "SUCCESS"
                  ).length;
                  const failureCount = results.filter(
                    (r) => r.status === "FAILED"
                  ).length;

                  if (successCount > 0 && failureCount === 0) {
                    showToast(
                      `Successfully posted to ${successCount} platform(s)`,
                      "success"
                    );
                  } else if (successCount > 0 && failureCount > 0) {
                    showToast(
                      `Posted to ${successCount} platform(s), ${failureCount} failed`,
                      "warning"
                    );
                  } else {
                    showToast("Failed to post to social media", "error");
                  }
                },
                onError: (error: any) => {
                  setPendingSocialPost(null);
                  showToast(
                    error?.response?.data?.message ||
                      "Failed to post to social media",
                    "error"
                  );
                },
              }
            );
          }
        },
      });
    }
  };

  const getStatusBadgeColor = (status: string, scheduledFor?: string) => {
    if (scheduledFor && new Date(scheduledFor) > new Date()) {
      return "bg-purple-100 text-purple-800";
    }
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "PENDING_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "ARCHIVED":
        return "bg-blue-100 text-blue-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string, scheduledFor?: string) => {
    if (scheduledFor && new Date(scheduledFor) > new Date()) {
      return "SCHEDULED";
    }
    return status;
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await newsApi.export();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `news-export-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showToast(
        t("admin.newsExported") || "News exported successfully",
        "success"
      );
    } catch (error: any) {
      console.error("Export error:", error);
      showToast(
        error?.response?.data?.message || 
        t("admin.exportFailed") || 
        "Failed to export news",
        "error"
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("admin.newsManagement")}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("admin.exporting") || "Exporting..."}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t("admin.exportNews") || "Export to Excel"}
              </>
            )}
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
          >
            + {t("admin.createNews")}
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("admin.search")}
            </label>
            <InputWithClear
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset to first page on search
              }}
              onClear={() => {
                setSearch("");
                setPage(1);
              }}
              placeholder={t("admin.search") + "..."}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("admin.status")}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t("admin.allStatus")}</option>
              <option value="DRAFT">{t("admin.draft")}</option>
              <option value="PENDING_REVIEW">{t("admin.pendingReview")}</option>
              <option value="PUBLISHED">{t("admin.published")}</option>
              <option value="ARCHIVED">{t("admin.archived")}</option>
              <option value="REJECTED">{t("admin.rejected")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("admin.category")}
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t("admin.allCategories")}</option>
              {(categoriesData as CategoryResponse | undefined)?.data?.map(
                (cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameEn}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="flex items-end">
            <ClearFilterButton
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setCategoryFilter("");
                setPage(1);
              }}
              disabled={!search && !statusFilter && !categoryFilter}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <ErrorMessage error={error} className="mb-4" />}

      {/* Loading State */}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* News Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {newsList.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {t("news.noNews")}.{" "}
                {search || statusFilter || categoryFilter
                  ? t("admin.filterBy")
                  : t("admin.createNews")}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                          {t("admin.title")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                          {t("admin.category")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                          {t("admin.status")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                          {t("admin.author")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                          {t("admin.created")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                          {t("admin.scheduled")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                          {t("admin.views")}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                          {t("admin.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {newsList.map((news: News) => (
                        <tr key={news.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {news.title}
                              </span>
                              {news.isBreaking && (
                                <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded">
                                  Breaking
                                </span>
                              )}
                              {news.isFeatured && (
                                <span className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded">
                                  Featured
                                </span>
                              )}
                              {news.isTG && (
                                <span className="px-2 py-0.5 text-xs bg-purple-500 text-white rounded">
                                  TG
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {news.category?.nameEn || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(
                                news.status,
                                (news as any).scheduledFor
                              )}`}
                            >
                              {getStatusLabel(
                                news.status,
                                (news as any).scheduledFor
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {news.author?.name || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {formatDate(news.createdAt, "MMM dd, yyyy")}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {(news as any).scheduledFor ? (
                              <span className="text-purple-600 font-medium">
                                {formatDate(
                                  (news as any).scheduledFor,
                                  "MMM dd, yyyy HH:mm"
                                )}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {news.views || 0}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Approve/Reject buttons for PENDING_REVIEW news (Admin only) */}
                              {news.status === "PENDING_REVIEW" && (
                                <>
                                  <button
                                    onClick={() => {
                                      if (
                                        !confirm(
                                          language === "it"
                                            ? "Sei sicuro di voler approvare e pubblicare questa notizia?"
                                            : "Are you sure you want to approve and publish this news?"
                                        )
                                      ) {
                                        return;
                                      }
                                      updateMutation.mutate(
                                        {
                                          id: news.id,
                                          data: { status: "PUBLISHED" },
                                        },
                                        {
                                          onSuccess: () => {
                                            showToast(
                                              language === "it"
                                                ? "Notizia approvata e pubblicata"
                                                : "News approved and published",
                                              "success"
                                            );
                                          },
                                          onError: (error: any) => {
                                            showToast(
                                              error?.response?.data?.message ||
                                                (language === "it"
                                                  ? "Errore durante l'approvazione"
                                                  : "Failed to approve news"),
                                              "error"
                                            );
                                          },
                                        }
                                      );
                                    }}
                                    disabled={updateMutation.isPending}
                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-xs rounded transition-colors font-medium"
                                    title={
                                      language === "it"
                                        ? "Approva e pubblica la notizia"
                                        : "Approve and publish the news"
                                    }
                                  >
                                    ✓ {language === "it" ? "Approva" : "Approve"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      const reason = prompt(
                                        language === "it"
                                          ? "Motivo del rifiuto (opzionale):"
                                          : "Rejection reason (optional):"
                                      );
                                      // If user cancels prompt, don't proceed
                                      if (reason === null) {
                                        return;
                                      }
                                      updateMutation.mutate(
                                        {
                                          id: news.id,
                                          data: {
                                            status: "REJECTED",
                                            // Note: rejectionReason might need to be added to the schema
                                          },
                                        },
                                        {
                                          onSuccess: () => {
                                            showToast(
                                              language === "it"
                                                ? "Notizia rifiutata"
                                                : "News rejected",
                                              "success"
                                            );
                                          },
                                          onError: (error: any) => {
                                            showToast(
                                              error?.response?.data?.message ||
                                                (language === "it"
                                                  ? "Errore durante il rifiuto"
                                                  : "Failed to reject news"),
                                              "error"
                                            );
                                          },
                                        }
                                      );
                                    }}
                                    disabled={updateMutation.isPending}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-xs rounded transition-colors font-medium"
                                    title={
                                      language === "it"
                                        ? "Rifiuta la notizia"
                                        : "Reject the news"
                                    }
                                  >
                                    ✗ {language === "it" ? "Rifiuta" : "Reject"}
                                  </button>
                                  <span className="text-gray-300">|</span>
                                </>
                              )}
                              <button
                                onClick={() => handleEdit(news)}
                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                              >
                                {t("common.edit")}
                              </button>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => setPreviewNews(news)}
                                className="text-green-600 hover:text-green-800 hover:underline text-sm"
                              >
                                {t("common.view")}
                              </button>
                              <span className="text-gray-300">|</span>
                              <Link
                                href={`/news/${news.slug || news.id}`}
                                target="_blank"
                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                              >
                                {t("common.view")}
                              </Link>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => handleDelete(news)}
                                className="text-red-600 hover:text-red-800 hover:underline text-sm"
                              >
                                {t("common.delete")}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="text-sm text-gray-700">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, meta.total)} of {meta.total}{" "}
                      results
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-sm text-gray-700">
                        Page {page} of {meta.totalPages}
                      </span>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= meta.totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* Create/Edit Modal */}
      {isCreateModalOpen && (
        <NewsFormModal
          news={editingNews}
          categories={
            (categoriesData as CategoryResponse | undefined)?.data || []
          }
          onSubmit={handleSubmit}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingNews(null);
            setPendingSocialPost(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
          error={createMutation.error || updateMutation.error}
          onSocialPost={handleSocialPost}
        />
      )}

      {/* Preview Modal */}
      {previewNews && (
        <NewsPreviewModal
          news={previewNews}
          categories={
            (categoriesData as CategoryResponse | undefined)?.data || []
          }
          onClose={() => setPreviewNews(null)}
          onOpenInNewTab={() => {
            window.open(
              `/news/${previewNews.slug || previewNews.id}`,
              "_blank"
            );
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingNews && (
        <DeleteConfirmModal
          title="Delete News"
          message={`Are you sure you want to delete "${deletingNews.title}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingNews(null)}
          isLoading={deleteMutation.isPending}
        />
      )}

      {/* Social Post Results Modal */}
      {socialPostResults && (
        <SocialPostResults
          results={socialPostResults}
          onClose={() => setSocialPostResults(null)}
        />
      )}
    </div>
  );
}
