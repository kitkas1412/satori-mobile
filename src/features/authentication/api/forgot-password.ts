import { api } from "@/lib/axios";
import type {
  ForgotPasswordParams,
  ForgotPasswordResponse,
} from "./auth.types";

export async function forgotPasswordApi(
  params: ForgotPasswordParams,
): Promise<ForgotPasswordResponse> {
  const { data } = await api.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    params,
  );
  return data;
}
