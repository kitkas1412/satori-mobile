// Hàm gọi API lấy chi tiết một topic hội thoại, bao gồm mô tả, gợi ý và danh sách nhiệm vụ.

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { TopicDetailResponse } from "./speaking.types";

/**
 * Lấy thông tin chi tiết của một topic theo ID.
 * Được dùng trong màn hình TopicDetailScreen trước khi bắt đầu luyện tập.
 *
 * @param topicId - ID của topic cần xem chi tiết
 * @returns Dữ liệu chi tiết topic bao gồm mô tả, từ vựng gợi ý và danh sách nhiệm vụ
 */
export async function getTopicDetailApi(
  topicId: string,
): Promise<TopicDetailResponse> {
  const response = await api.get<ApiResponse<TopicDetailResponse>>(
    `/learner/conversation/topics/${topicId}`,
  );
  return response.data.data;
}
