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

  if (axiosError?.code === "ECONNABORTED") {
    return "Yêu cầu quá thời gian chờ. Vui lòng thử lại.";
  }

  if (axiosError?.request && !axiosError?.response) {
    return "Không thể kết nối đến server. Vui lòng kiểm tra mạng.";
  }

  return (
    axiosError?.response?.data?.message ||
    (error instanceof Error ? error.message : undefined) ||
    fallback
  );
}
