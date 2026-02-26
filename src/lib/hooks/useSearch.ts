import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchApi, SearchFilters, SearchResult } from "@/lib/api/modules/search.api";
import { ApiResponse } from "@/types/api.types";

export const useSearch = (query: string, filters?: SearchFilters) => {
  return useQuery<ApiResponse<{ data: SearchResult }>>({
    queryKey: ["search", query, filters],
    queryFn: () => searchApi.search(query, filters),
    enabled: query.length >= 2, // Only search if query is at least 2 characters
    placeholderData: keepPreviousData, // Keep previous data while refetching to prevent data disappearing
    staleTime: 30 * 1000, // 30 seconds - search results can be fresh for 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes - keep in cache for 2 minutes
    refetchOnWindowFocus: false,
  });
};

