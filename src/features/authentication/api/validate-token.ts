import { api } from "@/lib/axios";
import type { User } from "./auth.types";

/** Response từ API kiểm tra token: trả về thông tin user nếu token còn hợp lệ. */
interface ValidateTokenResponse {
  success: boolean;
  data: User;
}

/**
 * Kiểm tra accessToken hiện tại có còn hợp lệ không bằng cách gọi `/auth/me`.
 * - Nếu token hợp lệ: server trả về thông tin user.
 * - Nếu token hết hạn (401): axios interceptor tự động thử refresh token.
 *   Nếu refresh cũng thất bại, interceptor gọi logout() và xóa cache.
 */
export async function validateTokenApi(): Promise<ValidateTokenResponse> {
  const { data } = await api.get<ValidateTokenResponse>("/auth/me");
  return data;
}
