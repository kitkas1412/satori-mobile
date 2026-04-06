// Hàm gọi API mở lại một phiên chat đã tồn tại.

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { ChatSessionResponse } from "./chatbot.types";

/**
 * Mở lại một phiên chat cũ để tiếp tục trò chuyện.
 *
 * @param sessionId - ID của phiên chat cần mở lại
 * @returns Dữ liệu phiên chat sau khi mở lại
 */
export async function reopenChatSessionApi(
  sessionId: string,
): Promise<ChatSessionResponse> {
  const response = await api.post<ApiResponse<ChatSessionResponse>>(
    `/learner/curriculum-chat/sessions/${sessionId}/reopen`,
  );
  return response.data.data;
}
