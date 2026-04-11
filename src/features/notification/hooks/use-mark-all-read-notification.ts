import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllReadNotificationApi } from "@/features/notification/api";
import { notificationQueryKeys } from "./use-notifications";

export function useMarkAllReadNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllReadNotificationApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.list(),
      });
    },
  });
}
