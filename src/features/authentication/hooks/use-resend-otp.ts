import { useMutation } from "@tanstack/react-query";
import type { ForgotPasswordParams, ForgotPasswordResponse } from "../api";
import { forgotPasswordApi } from "../api";

export const useResendOTP = () => {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordParams>({
    mutationFn: forgotPasswordApi,
  });
};
