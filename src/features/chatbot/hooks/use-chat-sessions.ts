import { useQuery } from "@tanstack/react-query";
import { getChatSessionsApi } from "@/features/chatbot/api";

export function useChatSessions(enabled: boolean) {
  return useQuery({
    queryKey: ["chat-sessions"],
    queryFn: getChatSessionsApi,
    enabled,
  });
}
