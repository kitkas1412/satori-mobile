import type { AxiosError } from "axios";

const DEFAULT_FALLBACK = "Có lỗi xảy ra. Vui lòng thử lại.";

/**
 * Trích xuất message lỗi từ AxiosError hoặc Error thông thường.
 * Ưu tiên: error.response.data.message → error.message → fallback
 */
export function extractApiError(
  error: unknown,
  fallback: string = DEFAULT_FALLBACK,
): string {
  const axiosError = error as AxiosError<{ message?: string }>;
  return (
    axiosError?.response?.data?.message ||
    (error instanceof Error ? error.message : undefined) ||
    fallback
  );
}
