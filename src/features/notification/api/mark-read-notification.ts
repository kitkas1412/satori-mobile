import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { MarkReadRequest, MarkReadResponse } from "./notification.types";

export async function markReadNotificationApi(
  body: MarkReadRequest,
): Promise<MarkReadResponse> {
  const response = await api.post<ApiResponse<number>>(
    "/notifications/mark-read",
    body,
  );
  return { success: response.data.success, data: response.data.data };
}
