import { api } from "@/lib/axios";
import type { LoginParams, LoginResponse } from "./auth.types";

export async function loginApi(params: LoginParams): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", params);
  return data;
}
