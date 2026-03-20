import { api } from "@/lib/axios";
import type { VerifyOTPParams, VerifyOTPResponse } from "./auth.types";

export async function verifyOTPApi(
  params: VerifyOTPParams,
): Promise<VerifyOTPResponse> {
  const { data } = await api.post<VerifyOTPResponse>(
    "/auth/verify-otp",
    params,
  );
  return data;
}
