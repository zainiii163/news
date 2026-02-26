import { useQuery, useMutation, useQueryClient, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { newsApi } from "@/lib/api/modules/news.api";
import { NewsResponse } from "@/types/news.types";
import { ApiResponse } from "@/types/api.types";

// Get all news
export const useNews = (params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  status?: string;
  refetchInterval?: number;
}) => {
  const { refetchInterval, ...queryParams } = params || {};
  return useQuery<ApiResponse<NewsResponse>>({
    queryKey: ["news", queryParams],
    queryFn: () => newsApi.getAll(queryParams),
    refetchInterval: refetchInterval,
    placeholderData: keepPreviousData, // Keep previous data while refetching to prevent data disappearing
    staleTime: 60 * 1000, // 1 minute - data is fresh for 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus to prevent unnecessary requests
  });
};

// Get news by ID or slug
export const useNewsDetail = (idOrSlug: string) => {
  return useQuery({
    queryKey: ["news", idOrSlug],
    queryFn: () => newsApi.getByIdOrSlug(idOrSlug),
    enabled: !!idOrSlug,
    placeholderData: keepPreviousData, // Keep previous data while refetching
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Create news mutation
export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: newsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

// Update news mutation
export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: import("@/types/news.types").UpdateNewsInput }) => newsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["news", variables.id] });
    },
  });
};

// Delete news mutation
export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: newsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

// Infinite query for homepage/news feed
export const useNewsInfinite = (params?: {
  categoryId?: string;
  search?: string;
  status?: string;
  limit?: number;
}) => {
  return useInfiniteQuery<ApiResponse<NewsResponse>>({
    queryKey: ["news", "infinite", params],
    queryFn: ({ pageParam }) =>
      newsApi.getAll({ ...params, page: pageParam as number, limit: params?.limit || 12 }),
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.data?.data?.meta;
      if (meta && meta.page < meta.totalPages) {
        return meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

