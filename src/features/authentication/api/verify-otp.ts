import { api } from "@/lib/axios";
import type { VerifyOTPParams, VerifyOTPResponse } from "./auth.types";

/**
 * Xác thực mã OTP người dùng nhập. Nếu đúng, server trả về `resetToken`
 * — token tạm thời dùng để gọi API đặt lại mật khẩu ở bước tiếp theo.
 */
export async function verifyOTPApi(
  params: VerifyOTPParams,
): Promise<VerifyOTPResponse> {
  const { data } = await api.post<VerifyOTPResponse>(
    "/auth/verify-otp",
    params,
  );
  return data;
}
