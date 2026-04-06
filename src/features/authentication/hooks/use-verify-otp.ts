import { useMutation } from "@tanstack/react-query";
import type { VerifyOTPRequest, VerifyOTPResponse } from "../api";
import { verifyOTPApi } from "../api";

/**
 * Hook xác thực mã OTP nhập bởi người dùng.
 * Khi thành công, trả về `resetToken` để dùng ở bước đặt lại mật khẩu.
 * Xử lý callback được thực hiện tại `useResetPasswordOTPForm`.
 */
export const useVerifyOTP = () => {
  return useMutation<VerifyOTPResponse, Error, VerifyOTPRequest>({
    mutationFn: verifyOTPApi,
  });
};
