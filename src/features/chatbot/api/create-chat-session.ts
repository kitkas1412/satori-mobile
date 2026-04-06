// Hàm gọi API khởi tạo phiên chat với AI theo chương trình học.

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { ChatSessionResponse, CreateChatSessionRequest } from "./chatbot.types";

/**
 * Khởi tạo một phiên chat mới với AI trợ lý theo chương trình học.
 *
 * @param request - courseId và jlptLevel của người dùng
 * @returns Dữ liệu phiên chat mới bao gồm sessionId và trạng thái
 */
export async function createChatSessionApi(
  request: CreateChatSessionRequest,
): Promise<ChatSessionResponse> {
  const response = await api.post<ApiResponse<ChatSessionResponse>>(
    "/learner/curriculum-chat/sessions",
    request,
  );
  return response.data.data;
}
