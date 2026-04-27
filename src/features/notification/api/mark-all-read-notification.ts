import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { MarkReadResponse } from "./notification.types";

export async function markAllReadNotificationApi(): Promise<MarkReadResponse> {
  const response = await api.post<ApiResponse<number>>(
    "/notifications/mark-all-read",
  );
  return { success: response.data.success, data: response.data.data };
}
