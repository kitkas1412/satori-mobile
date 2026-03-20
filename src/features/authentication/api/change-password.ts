import { api } from "@/lib/axios";
import type {
  ChangePasswordParams,
  ChangePasswordResponse,
} from "./auth.types";

export async function changePasswordApi(
  params: ChangePasswordParams,
): Promise<ChangePasswordResponse> {
  const response = await api.post<ChangePasswordResponse>(
    "/auth/change-password",
    params,
  );
  return response.data;
}
