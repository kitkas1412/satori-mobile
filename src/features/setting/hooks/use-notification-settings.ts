import { getNotificationSettings } from "@/features/setting/api";
import { useQuery } from "@tanstack/react-query";

export const notificationSettingsQueryKey = ["setting", "notificationSettings"] as const;

export function useNotificationSettings() {
  return useQuery({
    queryKey: notificationSettingsQueryKey,
    queryFn: getNotificationSettings,
  });
}
