import { api } from "@/lib/axios";
import type {
  RegisterDeviceTokenParams,
  RegisterDeviceTokenResponse,
} from "./notification.types";

export async function registerDeviceTokenApi(
  params: RegisterDeviceTokenParams,
): Promise<RegisterDeviceTokenResponse> {
  const response = await api.post<RegisterDeviceTokenResponse>(
    "/notifications/device-token",
    params,
  );
  return response.data;
}
