// Hàm gọi API lấy danh sách phiên chat của người dùng.

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { ChatSessionListResponse } from "./chatbot.types";

/**
 * Lấy danh sách phiên chat đã tạo.
 *
 * @returns Danh sách phiên chat dạng phân trang
 */
export async function getChatSessionsApi(): Promise<ChatSessionListResponse> {
  const response = await api.get<ApiResponse<ChatSessionListResponse>>(
    "/learner/curriculum-chat/sessions",
  );
  return response.data.data;
}
