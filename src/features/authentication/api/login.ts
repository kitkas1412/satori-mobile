import { api } from "@/lib/axios";
import type { LoginParams, LoginResponse } from "./auth.types";

/**
 * Gọi API đăng nhập với email, password và thông tin thiết bị.
 * Trả về accessToken, refreshToken và thông tin user khi thành công.
 */
export async function loginApi(params: LoginParams): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", params);
  return data;
}
