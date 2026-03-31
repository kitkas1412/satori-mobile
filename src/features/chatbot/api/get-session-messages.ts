// Hàm gọi API lấy lịch sử tin nhắn của một phiên chat.

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { ChatSessionMessage } from "./chatbot.types";

/**
 * Lấy danh sách tin nhắn trong một phiên chat.
 *
 * @param sessionId - ID của phiên chat
 * @returns Danh sách tin nhắn theo thứ tự thời gian
 */
export async function getSessionMessagesApi(
  sessionId: string,
): Promise<ChatSessionMessage[]> {
  const response = await api.get<ApiResponse<ChatSessionMessage[]>>(
    `/learner/curriculum-chat/sessions/${sessionId}/messages`,
    { params: { page: 0, size: 50 } },
  );
  return response.data.data;
}
