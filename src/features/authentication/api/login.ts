import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { LoginParams, LoginResponse } from "./auth.types";

export async function loginApi(params: LoginParams): Promise<LoginResponse> {
  const response = await api.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    params,
  );
  return response.data.data;
}

export async function logoutApi(): Promise<void> {
  await api.post("/auth/logout");
}
