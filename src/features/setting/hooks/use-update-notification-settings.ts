import { updateNotificationSettings } from "@/features/setting/api";
import type {
  NotificationSettings,
  UpdateNotificationSettingsRequest,
} from "@/features/setting/api";
import { notificationSettingsQueryKeys } from "./use-notification-settings";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UpdateNotificationSettingsRequest>) => {
      const cached = queryClient.getQueryData<NotificationSettings>(
        notificationSettingsQueryKeys.all,
      );
      return updateNotificationSettings({
        ...cached,
        ...data,
      } as UpdateNotificationSettingsRequest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationSettingsQueryKeys.all });
    },
  });
}
