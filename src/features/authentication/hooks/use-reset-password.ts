import { useMutation } from "@tanstack/react-query";
import type { ResetPasswordParams, ResetPasswordResponse } from "../api";
import { resetPasswordApi } from "../api";

export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordParams>({
    mutationFn: resetPasswordApi,
  });
};
