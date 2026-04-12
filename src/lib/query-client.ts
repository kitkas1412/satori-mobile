import { MutationCache, QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { extractApiError } from "@/lib/extract-api-error";
import { useErrorOverlayStore } from "@/stores/error-overlay-store";

const mutationCache = new MutationCache({
  onError: (error, _vars, _ctx, mutation) => {
    // Cho phép mutation tự xử lý lỗi (ví dụ: chatbot tự show overlay với onBack riêng)
    if ((mutation.meta as Record<string, unknown>)?.suppressGlobalError) return;
    // 401 đã được axios interceptor xử lý (refresh token / logout)
    if ((error as AxiosError)?.response?.status === 401) return;
    useErrorOverlayStore.getState().show(extractApiError(error));
  },
});

export const queryClient = new QueryClient({
  mutationCache,
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 phút
      gcTime: 10 * 60 * 1000, // 10 phút
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
