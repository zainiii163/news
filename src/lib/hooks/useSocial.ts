import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { socialApi, ConnectAccountInput, PostToSocialParams } from "@/lib/api/modules/social.api";

// Get connected accounts
export const useSocialAccounts = () => {
  return useQuery({
    queryKey: ["social", "accounts"],
    queryFn: async () => {
      try {
        const response = await socialApi.getAccounts();
        // Response structure from apiClient: { success: true, message: string, data: { accounts: SocialAccount[] } }
        // apiClient.get returns ApiResponse<T> where T is the type passed to get<>
        // So response is ApiResponse<{ accounts: SocialAccount[] }>
        // Which means response.data is { accounts: SocialAccount[] }
        const accounts = (response.data as { accounts?: unknown[] })?.accounts || [];
        return { accounts };
      } catch (error) {
        console.error("Error fetching social accounts:", error);
        return { accounts: [] };
      }
    },
    placeholderData: keepPreviousData, // Keep previous data while refetching to prevent data disappearing
    refetchOnWindowFocus: false, // Don't refetch on window focus to prevent data disappearing
    refetchOnMount: true,
    staleTime: 30 * 1000, // 30 seconds - data is fresh for 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes - keep in cache for 2 minutes (gcTime replaces cacheTime in v5)
  });
};

// Connect account mutation
export const useConnectAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConnectAccountInput) => socialApi.connectAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social", "accounts"] });
    },
  });
};

// Disconnect account mutation
export const useDisconnectAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => socialApi.disconnectAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social", "accounts"] });
    },
  });
};

// Post to social media mutation
export const usePostToSocial = () => {
  return useMutation({
    mutationFn: (params: PostToSocialParams) => socialApi.post(params),
  });
};

