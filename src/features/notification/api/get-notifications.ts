import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { NotificationsResponse } from "./notification.types";

export async function getNotificationsApi(
  pageParam: number = 0,
  size: number = 20,
): Promise<NotificationsResponse> {
  const response = await api.get<ApiResponse<NotificationsResponse>>(
    "/notifications",
    { params: { page: pageParam, size } },
  );
  return response.data.data;
}
