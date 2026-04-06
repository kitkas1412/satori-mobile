import { useMutation } from "@tanstack/react-query";
import type { ResetPasswordRequest, ResetPasswordResponse } from "../api";
import { resetPasswordApi } from "../api";

/**
 * Hook đặt lại mật khẩu mới sử dụng `resetToken` từ bước xác thực OTP.
 * Xử lý callback (điều hướng sau thành công) được thực hiện tại `useResetPasswordForm`.
 */
export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
    mutationFn: resetPasswordApi,
  });
};
