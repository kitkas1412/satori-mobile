import { useMutation } from "@tanstack/react-query";
import { reopenChatSessionApi } from "@/features/chatbot/api";

export function useReopenSession() {
  return useMutation({
    mutationFn: (sessionId: string) => reopenChatSessionApi(sessionId),
  });
}
