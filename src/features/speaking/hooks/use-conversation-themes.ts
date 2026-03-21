// Hook và query keys cho dữ liệu themes (chủ đề hội thoại) trong feature Speaking.

import { useQuery } from "@tanstack/react-query";
import { getThemesApi } from "../api";

/**
 * Tập trung tất cả query keys của feature Speaking vào một nơi.
 * Giúp dễ dàng invalidate cache khi cần cập nhật dữ liệu.
 */
export const speakingQueryKeys = {
  /** Key cho danh sách tất cả themes */
  themes: ["speaking", "themes"] as const,
  /** Key cho danh sách topics của một theme cụ thể */
  topics: (themeId: string) => ["speaking", "topics", themeId] as const,
  /** Key cho chi tiết của một topic cụ thể */
  topicDetail: (topicId: string) =>
    ["speaking", "topicDetail", topicId] as const,
};

/**
 * Lấy danh sách tất cả themes hội thoại.
 * Kết quả được cache bởi React Query, tự động refetch khi stale.
 */
export function useConversationThemes() {
  return useQuery({
    queryKey: speakingQueryKeys.themes,
    queryFn: getThemesApi,
  });
}
