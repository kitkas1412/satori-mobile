// Hàm gọi API lấy chi tiết một conversation hội thoại, bao gồm mô tả, gợi ý và danh sách nhiệm vụ.

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { ConversationDetailResponse } from "./speaking.types";

/**
 * Lấy thông tin chi tiết của một conversation theo ID.
 * Được dùng trong màn hình ConversationDetailScreen trước khi bắt đầu luyện tập.
 *
 * @param conversationId - ID của conversation cần xem chi tiết
 * @returns Dữ liệu chi tiết conversation bao gồm mô tả, từ vựng gợi ý và danh sách nhiệm vụ
 */
export async function getConversationDetailApi(
  conversationId: string,
): Promise<ConversationDetailResponse> {
  const response = await api.get<ApiResponse<ConversationDetailResponse>>(
    `/learner/conversation/topics/${conversationId}`,
  );
  return response.data.data;
}
