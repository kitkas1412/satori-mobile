import { useMutation } from "@tanstack/react-query";
import type { ForgotPasswordRequest, ForgotPasswordResponse } from "../api";
import { forgotPasswordApi } from "../api";

/**
 * Hook gửi lại mã OTP khi người dùng chưa nhận được hoặc OTP đã hết hạn.
 * Tái sử dụng cùng API endpoint với `useForgotPassword` vì logic server giống nhau.
 * Xử lý countdown và callback được thực hiện tại `useResetPasswordOTPForm`.
 */
export const useResendOTP = () => {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
    mutationFn: forgotPasswordApi,
  });
};
