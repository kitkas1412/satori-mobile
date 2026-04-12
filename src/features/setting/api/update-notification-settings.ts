import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  NotificationSettings,
  UpdateNotificationSettingsRequest,
} from "./notification-settings.types";

export async function updateNotificationSettings(
  data: UpdateNotificationSettingsRequest,
): Promise<NotificationSettings> {
  const response = await api.put<ApiResponse<NotificationSettings>>(
    "/api/v1/notifications/preferences",
    data,
  );
  return response.data.data;
}
