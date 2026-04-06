import { api } from "@/lib/axios";
import type { ResetPasswordRequest, ResetPasswordResponse } from "./auth.types";

/**
 * Đặt lại mật khẩu mới bằng `resetToken` nhận được sau khi xác thực OTP.
 * `resetToken` chỉ dùng được một lần và có thời hạn ngắn.
 */
export async function resetPasswordApi(
  params: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
  const { data } = await api.post<ResetPasswordResponse>(
    "/auth/reset-password",
    params,
  );
  return data;
}
