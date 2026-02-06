import { api } from "@/lib/axios";
import type { ResetPasswordParams, ResetPasswordResponse } from "./auth.types";

export async function resetPasswordApi(
  params: ResetPasswordParams,
): Promise<ResetPasswordResponse> {
  const { data } = await api.post<ResetPasswordResponse>(
    "/auth/reset-password",
    params,
  );
  return data;
}
