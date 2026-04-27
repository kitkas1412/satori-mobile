import { getNotificationSettings } from "@/features/setting/api";
import { useQuery } from "@tanstack/react-query";

export const notificationSettingsQueryKeys = {
  all: ["setting", "notificationSettings"] as const,
  filtered: () => [...notificationSettingsQueryKeys.all] as const,
};

export function useNotificationSettings() {
  return useQuery({
    queryKey: notificationSettingsQueryKeys.all,
    queryFn: getNotificationSettings,
  });
}
