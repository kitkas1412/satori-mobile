import { useNotifications } from "./use-notifications";

export function useUnreadNotificationsCount() {
  const { data, hasNextPage } = useNotifications();
  const allLoaded = data?.pages.flatMap((p) => p.content) ?? [];
  const unreadCount = allLoaded.filter((n) => !n.isRead).length;
  return {
    unreadCount,
    hasMore: !!hasNextPage && unreadCount > 0,
  };
}
