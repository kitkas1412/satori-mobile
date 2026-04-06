// Hàm gọi API gửi tin nhắn trong phiên chat với AI.

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { SendMessageRequest, SendMessageResponse } from "./chatbot.types";

/**
 * Gửi tin nhắn của người dùng trong một phiên chat.
 *
 * @param sessionId - ID của phiên chat hiện tại
 * @param request - Nội dung tin nhắn cần gửi
 * @returns Phản hồi từ AI bao gồm messageId, content và metadata
 */
export async function sendMessageApi(
  sessionId: string,
  request: SendMessageRequest,
): Promise<SendMessageResponse> {
  const response = await api.post<ApiResponse<SendMessageResponse>>(
    `/learner/curriculum-chat/sessions/${sessionId}/messages`,
    request,
  );
  return response.data.data;
}
