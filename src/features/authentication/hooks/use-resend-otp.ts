import { useMutation } from "@tanstack/react-query";
import type { ResendOTPParams, ResendOTPResponse } from "../api";
import { resendOTPApi } from "../api";

export const useResendOTP = () => {
  return useMutation<ResendOTPResponse, Error, ResendOTPParams>({
    mutationFn: resendOTPApi,
  });
};
