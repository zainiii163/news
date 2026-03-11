import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { transportApi } from "@/lib/api/modules/transport.api";
import { TransportType } from "@/types/transport.types";

export const useTransport = (params?: {
  page?: number;
  limit?: number;
  type?: TransportType;
  city?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["transport", params],
    queryFn: () => transportApi.getAll(params),
    placeholderData: keepPreviousData, // Keep previous data while refetching to prevent data disappearing
    staleTime: 1000 * 60 * 60, // 1 hour - transport info doesn't change frequently
    gcTime: 2 * 60 * 60 * 1000, // 2 hours - keep in cache for 2 hours
    refetchOnWindowFocus: false,
  });
};

