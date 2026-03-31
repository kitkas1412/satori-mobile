import { useMutation } from "@tanstack/react-query";
import { sendMessageApi } from "@/features/chatbot/api";

export function useSendMessage() {
  return useMutation({
    mutationFn: ({
      sessionId,
      message,
    }: {
      sessionId: string;
      message: string;
    }) => sendMessageApi(sessionId, { message }),
  });
}
