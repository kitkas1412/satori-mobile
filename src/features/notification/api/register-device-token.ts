import { api } from "@/lib/axios";
import type {
  RegisterDeviceTokenRequest,
  RegisterDeviceTokenResponse,
} from "./notification.types";

export async function registerDeviceTokenApi(
  params: RegisterDeviceTokenRequest,
): Promise<RegisterDeviceTokenResponse> {
  const response = await api.post<RegisterDeviceTokenResponse>(
    "/notifications/device-token",
    params,
  );
  return response.data;
}
