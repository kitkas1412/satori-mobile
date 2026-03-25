import { useQuery } from "@tanstack/react-query";
import { getConversationsApi } from "../api";
import { speakingQueryKeys } from "./use-topics";

export function useConversations(topicId: string) {
  return useQuery({
    queryKey: speakingQueryKeys.conversations(topicId),
    queryFn: () => getConversationsApi(topicId),
  });
}
