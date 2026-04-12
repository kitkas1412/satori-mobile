import { useQuery } from "@tanstack/react-query";
import { getLatestFeedbackApi } from "@/features/speaking/api";

export function useLatestFeedback(conversationId: string | undefined) {
  return useQuery({
    queryKey: ["speaking", "latestFeedback", conversationId] as const,
    queryFn: () => getLatestFeedbackApi(conversationId!),
    enabled: !!conversationId,
  });
}
