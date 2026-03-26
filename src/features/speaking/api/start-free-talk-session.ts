// Hàm gọi API khởi tạo session hội thoại tự do (free-talk) không gắn với topic cụ thể.
// AI sẽ tự điều chỉnh nội dung hội thoại dựa theo cấp độ JLPT của người dùng.

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  FreeTalkSessionRequest,
  RoleplaySessionResponse,
} from "./speaking.types";

/**
 * Khởi tạo một session hội thoại tự do với AI.
 * Khác với session theo topic, free-talk không có danh sách nhiệm vụ định sẵn.
 *
 * @param request - Cấp độ JLPT và ngôn ngữ UI của người dùng
 * @returns Dữ liệu session mới bao gồm ID và các tin nhắn mở đầu từ AI
 */
export async function startFreeTalkSessionApi(
  request: FreeTalkSessionRequest,
): Promise<RoleplaySessionResponse> {
  const response = await api.post<ApiResponse<RoleplaySessionResponse>>(
    "/learner/roleplay/free-talk/sessions",
    request,
  );
  return response.data.data;
}
