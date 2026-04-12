import { useMutation } from "@tanstack/react-query";
import { createChatSessionApi } from "@/features/chatbot/api";
import type { CreateChatSessionRequest } from "@/features/chatbot/api";

export function useCreateChatSession() {
  return useMutation({
    mutationFn: (request: CreateChatSessionRequest) =>
      createChatSessionApi(request),
    // Component tự xử lý lỗi với onBack phù hợp — tránh global overlay router.back()
    meta: { suppressGlobalError: true },
  });
}
