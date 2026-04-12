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
    // Component tự xử lý lỗi với onBack phù hợp — tránh global overlay router.back()
    meta: { suppressGlobalError: true },
  });
}
