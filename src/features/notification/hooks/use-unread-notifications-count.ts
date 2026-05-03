import { useNotifications } from "./use-notifications";

export function useUnreadNotificationsCount() {
  const { data } = useNotifications();
  const allLoaded = data?.pages.flatMap((p) => p.content) ?? [];
  return { hasUnread: allLoaded.some((n) => !n.isRead) };
}
