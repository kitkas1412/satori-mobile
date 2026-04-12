import { updateNotificationSettings } from "@/features/setting/api";
import type {
  NotificationSettings,
  UpdateNotificationSettingsRequest,
} from "@/features/setting/api";
import { notificationSettingsQueryKey } from "./use-notification-settings";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UpdateNotificationSettingsRequest>) => {
      const cached = queryClient.getQueryData<NotificationSettings>(
        notificationSettingsQueryKey,
      );
      return updateNotificationSettings({
        ...cached,
        ...data,
      } as UpdateNotificationSettingsRequest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationSettingsQueryKey });
    },
  });
}
