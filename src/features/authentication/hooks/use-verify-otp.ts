import { useMutation } from "@tanstack/react-query";
import type { VerifyOTPParams, VerifyOTPResponse } from "../api";
import { verifyOTPApi } from "../api";

export const useVerifyOTP = () => {
  return useMutation<VerifyOTPResponse, Error, VerifyOTPParams>({
    mutationFn: verifyOTPApi,
  });
};
