import { api } from "@/lib/axios";
import { LogoutResponse } from "./auth.types";

export async function logoutApi(): Promise<LogoutResponse> {
  const response = await api.post<LogoutResponse>("/auth/logout");
  return response.data;
}
