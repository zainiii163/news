import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { adsApi } from "@/lib/api/modules/ads.api";
import { UpdateAdInput, AdResponse } from "@/types/ads.types";
import { ApiResponse } from "@/types/api.types";

// Get all ads
export const useAds = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}) => {
  return useQuery<AdResponse>({
    queryKey: ["ads", params],
    queryFn: async () => {
      const response = await adsApi.getAll(params);
      if (!response.data) {
        throw new Error('No data received');
      }
      return response.data;
    },
    placeholderData: keepPreviousData, // Keep previous data while refetching to prevent data disappearing
    staleTime: 30 * 1000, // 30 seconds - data is fresh for 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes - keep in cache for 2 minutes
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus to prevent data disappearing
  });
};

// Create ad mutation
export const useCreateAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adsApi.create,
    onSuccess: () => {
      // Invalidate and refetch all ads queries (including all param variations)
      queryClient.invalidateQueries({
        queryKey: ["ads"],
        refetchType: "active",
        exact: false // Match all queries starting with ["ads"]
      });
    },
  });
};

// Update ad mutation
export const useUpdateAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdInput }) => adsApi.update(id, data),
    onSuccess: () => {
      // Invalidate and refetch all ads queries (including all param variations)
      queryClient.invalidateQueries({
        queryKey: ["ads"],
        refetchType: "active",
        exact: false // Match all queries starting with ["ads"]
      });
    },
  });
};

// Delete ad mutation
export const useDeleteAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adsApi.delete,
    onSuccess: () => {
      // Invalidate and refetch all ads queries (including all param variations)
      queryClient.invalidateQueries({
        queryKey: ["ads"],
        refetchType: "active",
        exact: false // Match all queries starting with ["ads"]
      });
    },
  });
};

// Create payment intent mutation
export const useCreatePayment = () => {
  return useMutation({
    mutationFn: adsApi.createPayment,
  });
};

// Get ad by slot (supports multiple ads for FOOTER, SIDEBAR, MOBILE, TOP_BANNER)
export const useAdBySlot = (slot: string, limit: number = 2) => {
  const multiSlots = ["FOOTER", "SIDEBAR", "MOBILE", "TOP_BANNER"];
  const effectiveLimit = multiSlots.includes(slot) ? Math.max(5, limit) : limit;
  return useQuery<AdResponse>({
    queryKey: ["ads", "slot", slot, effectiveLimit],
    queryFn: async () => {
      const response = await adsApi.getBySlot(slot, effectiveLimit);
      if (!response.data) {
        throw new Error('No data received');
      }
      return response.data;
    },
    placeholderData: keepPreviousData, // Keep previous data while refetching
    staleTime: 1000 * 60 * 5, // 5 minutes - ads don't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 minutes
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
  });
};

// Get ad by type (for TICKER, SLIDER, POPUP, STICKY ad types)
export const useAdByType = (type: string, limit: number = 2) => {
  return useQuery<AdResponse>({
    queryKey: ["ads", "type", type, limit],
    queryFn: async () => {
      const response = await adsApi.getByType(type, limit);
      if (!response.data) {
        throw new Error('No data received');
      }
      return response.data;
    },
    placeholderData: keepPreviousData, // Keep previous data while refetching
    staleTime: 1000 * 60 * 5, // 5 minutes - ads don't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 minutes
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
  });
};

// Track impression mutation
export const useTrackImpression = () => {
  return useMutation({
    mutationFn: adsApi.trackImpression,
  });
};

// Track click mutation
export const useTrackClick = () => {
  return useMutation({
    mutationFn: adsApi.trackClick,
  });
};

// Get ad analytics
export const useAdAnalytics = (id: string) => {
  return useQuery({
    queryKey: ["ads", "analytics", id],
    queryFn: async () => {
      const response = await adsApi.getAnalytics(id);
      return response.data!;
    },
    enabled: !!id,
    placeholderData: keepPreviousData, // Keep previous data while refetching
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Get advertiser analytics
export const useAdvertiserAnalytics = () => {
  return useQuery({
    queryKey: ["ads", "analytics", "me"],
    queryFn: async () => {
      const response = await adsApi.getAdvertiserAnalytics();
      return response.data!;
    },
    placeholderData: keepPreviousData, // Keep previous data while refetching
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
  });
};

