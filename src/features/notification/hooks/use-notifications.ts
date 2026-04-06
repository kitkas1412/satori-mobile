import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotificationsApi } from "../api";

export const notificationQueryKeys = {
  list: () => ["notification", "list"] as const,
};

export function useNotifications() {
  return useInfiniteQuery({
    queryKey: notificationQueryKeys.list(),
    queryFn: ({ pageParam }) => getNotificationsApi(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
    staleTime: 0,
  });
}
