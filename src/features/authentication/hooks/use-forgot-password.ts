import { useMutation } from "@tanstack/react-query";
import type { ForgotPasswordParams, ForgotPasswordResponse } from "../api";
import { forgotPasswordApi } from "../api";

/**
 * Hook gửi yêu cầu quên mật khẩu.
 * Gọi API để server gửi mã OTP về email người dùng.
 * Xử lý onSuccess/onError được thực hiện tại `useForgotPasswordForm`.
 */
export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordParams>({
    mutationFn: forgotPasswordApi,
  });
};
