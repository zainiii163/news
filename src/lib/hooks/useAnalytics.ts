import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/modules/analytics.api";
import { AdAnalyticsResponse, AdvertiserAnalyticsResponse } from "@/types/ads.types";

// Get ad analytics
export const useAdAnalytics = (id: string) => {
  return useQuery<AdAnalyticsResponse>({
    queryKey: ["analytics", "ad", id],
    queryFn: async () => {
      const response = await analyticsApi.getAdAnalytics(id);
      if (!response.data) {
        throw new Error('No analytics data received');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get advertiser analytics
export const useAdvertiserAnalytics = () => {
  return useQuery<AdvertiserAnalyticsResponse>({
    queryKey: ["analytics", "advertiser"],
    queryFn: async () => {
      const response = await analyticsApi.getAdvertiserAnalytics();
      if (!response.data) {
        throw new Error('No advertiser analytics data received');
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
  });
};

