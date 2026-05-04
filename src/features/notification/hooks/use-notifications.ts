import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotificationsApi } from "../api";

export const notificationQueryKeys = {
  list: () => ["notification", "list"] as const,
};

export function useNotifications() {
  return useInfiniteQuery({
    queryKey: notificationQueryKeys.list(),
    queryFn: ({ pageParam }) => getNotificationsApi(pageParam, 20),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { number, totalPages } = lastPage.page;
      return number + 1 < totalPages ? number + 1 : undefined;
    },
    staleTime: 0,
  });
}
