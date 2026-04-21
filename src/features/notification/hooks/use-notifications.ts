import { useQuery } from "@tanstack/react-query";
import { getNotificationsApi } from "../api";

export const notificationQueryKeys = {
  list: () => ["notification", "list"] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: notificationQueryKeys.list(),
    queryFn: () => getNotificationsApi(0, 100),
    staleTime: 0,
  });
}
