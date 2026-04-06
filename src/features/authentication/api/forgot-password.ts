import { api } from "@/lib/axios";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "./auth.types";

/**
 * Yêu cầu server gửi mã OTP về email để bắt đầu quy trình đặt lại mật khẩu.
 * Endpoint này là public — không cần accessToken.
 */
export async function forgotPasswordApi(
  params: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  const { data } = await api.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    params,
  );
  return data;
}
