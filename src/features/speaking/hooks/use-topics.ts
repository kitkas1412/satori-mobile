// Hook và query keys cho dữ liệu topics (chủ đề hội thoại) trong feature Speaking.

import { useQuery } from "@tanstack/react-query";
import { getTopicsApi } from "../api";

/**
 * Tập trung tất cả query keys của feature Speaking vào một nơi.
 * Giúp dễ dàng invalidate cache khi cần cập nhật dữ liệu.
 */
export const speakingQueryKeys = {
  /** Key cho danh sách tất cả topics */
  topics: ["speaking", "topics"] as const,
  /** Key cho danh sách conversations của một topic cụ thể */
  conversations: (topicId: string) => ["speaking", "conversations", topicId] as const,
  /** Key cho chi tiết của một conversation cụ thể */
  conversationDetail: (conversationId: string) =>
    ["speaking", "conversationDetail", conversationId] as const,
};

/**
 * Lấy danh sách tất cả topics hội thoại.
 * Kết quả được cache bởi React Query, tự động refetch khi stale.
 */
export function useTopics() {
  return useQuery({
    queryKey: speakingQueryKeys.topics,
    queryFn: getTopicsApi,
  });
}
