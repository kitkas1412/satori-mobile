import { api } from "@/lib/axios";
import { LogoutResponse } from "./auth.types";

/**
 * Gọi API đăng xuất để server hủy phiên đăng nhập hiện tại.
 * Yêu cầu accessToken hợp lệ trong header (tự động đính kèm bởi axios interceptor).
 */
export async function logoutApi(): Promise<LogoutResponse> {
  const response = await api.post<LogoutResponse>("/auth/logout");
  return response.data;
}
