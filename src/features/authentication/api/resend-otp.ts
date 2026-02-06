import { api } from "@/lib/axios";
import type { ResendOTPParams, ResendOTPResponse } from "./auth.types";

export async function resendOTPApi(
  params: ResendOTPParams,
): Promise<ResendOTPResponse> {
  const { data } = await api.post<ResendOTPResponse>(
    "/auth/resend-otp",
    params,
  );
  return data;
}
