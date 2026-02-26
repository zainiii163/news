import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api/modules/categories.api";
import { CategoryResponse, UpdateCategoryInput } from "@/types/category.types";
import { ApiResponse } from "@/types/api.types";

// Get all categories
export const useCategories = (flat?: boolean) => {
  return useQuery<ApiResponse<CategoryResponse>>({
    queryKey: ["categories", flat],
    queryFn: () => categoriesApi.getAll(flat),
    staleTime: 5 * 60 * 1000, // 5 minutes - categories don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache longer
    retry: 2, // Retry failed requests twice
    retryDelay: 1000, // Wait 1 second between retries
    // Keep previous data while refetching to prevent data disappearing
    placeholderData: keepPreviousData,
    // Don't refetch on window focus to prevent unnecessary requests
    refetchOnWindowFocus: false,
    // Don't refetch on reconnect if we have data
    refetchOnReconnect: false,
  });
};

// Get category by ID
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
    placeholderData: keepPreviousData, // Keep previous data while refetching
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Create category mutation
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// Update category mutation
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) => categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// Delete category mutation
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// Update category order mutation (bulk) with optimistic updates
export const useUpdateCategoryOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Array<{ id: string; order: number }>) => categoriesApi.updateOrder(updates),
    onMutate: async (updates) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      // Snapshot the previous value
      const previousCategories = queryClient.getQueriesData({ queryKey: ["categories"] });

      // Optimistically update the cache
      queryClient.setQueriesData<CategoryResponse>(
        { queryKey: ["categories"] },
        (old) => {
          if (!old?.data) return old;
          
          const updated = old.data.map((cat) => {
            const update = updates.find((u) => u.id === cat.id);
            return update ? { ...cat, order: update.order } : cat;
          });

          return { ...old, data: updated };
        }
      );

      return { previousCategories };
    },
    onError: (err, updates, context) => {
      // Rollback on error
      if (context?.previousCategories) {
        context.previousCategories.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

