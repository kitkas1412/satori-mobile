import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markReadNotificationApi } from "@/features/notification/api";
import type { MarkReadRequest } from "@/features/notification/api";
import { notificationQueryKeys } from "./use-notifications";

export function useMarkReadNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: MarkReadRequest) => markReadNotificationApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.list(),
      });
    },
  });
}
