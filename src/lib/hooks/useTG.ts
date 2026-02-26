import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { tgApi, TGVideosResponse } from "@/lib/api/modules/tg.api";
import { ApiResponse } from "@/types/api.types";

// Get all TG videos
export const useTGVideos = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: "createdAt" | "duration";
  sortOrder?: "asc" | "desc";
}) => {
  return useQuery<ApiResponse<TGVideosResponse>>({
    queryKey: ["tg", "videos", params],
    queryFn: () => tgApi.getVideos(params),
    placeholderData: keepPreviousData, // Keep previous data while refetching to prevent data disappearing
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Get single TG video
export const useTGVideo = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["tg", "videos", id],
    queryFn: () => tgApi.getVideoById(id),
    enabled: enabled && !!id,
    placeholderData: keepPreviousData, // Keep previous data while refetching
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Get related videos
export const useRelatedTGVideos = (id: string, limit: number = 6) => {
  return useQuery({
    queryKey: ["tg", "videos", "related", id, limit],
    queryFn: () => tgApi.getRelatedVideos(id, limit),
    enabled: !!id,
    placeholderData: keepPreviousData, // Keep previous data while refetching
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Get popular videos
export const usePopularTGVideos = (limit: number = 10) => {
  return useQuery({
    queryKey: ["tg", "videos", "popular", limit],
    queryFn: () => tgApi.getPopularVideos(limit),
    placeholderData: keepPreviousData, // Keep previous data while refetching
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

