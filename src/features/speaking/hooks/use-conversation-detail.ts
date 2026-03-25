import { useQuery } from "@tanstack/react-query";
import { getConversationDetailApi } from "../api";
import { speakingQueryKeys } from "./use-topics";

export function useConversationDetail(conversationId: string) {
  return useQuery({
    queryKey: speakingQueryKeys.conversationDetail(conversationId),
    queryFn: () => getConversationDetailApi(conversationId),
    enabled: !!conversationId,
  });
}
