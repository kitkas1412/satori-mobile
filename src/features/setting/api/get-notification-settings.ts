import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { NotificationSettings } from "./notification-settings.types";

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const response = await api.get<ApiResponse<NotificationSettings>>(
    "/notifications/preferences",
  );
  return response.data.data;
}
