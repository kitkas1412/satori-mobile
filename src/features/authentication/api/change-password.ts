import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  ChangePasswordParams,
  ChangePasswordResponse,
} from "./auth.types";

export async function changePasswordApi(
  params: ChangePasswordParams,
): Promise<ChangePasswordResponse> {
  const response = await api.post<ApiResponse<ChangePasswordResponse>>(
    "/auth/change-password",
    params,
  );
  return response.data.data;
}
