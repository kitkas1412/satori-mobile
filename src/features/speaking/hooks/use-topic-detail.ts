import { useQuery } from "@tanstack/react-query";
import { getTopicDetailApi } from "../api";
import { speakingQueryKeys } from "./use-conversation-themes";

export function useTopicDetail(topicId: string) {
  return useQuery({
    queryKey: speakingQueryKeys.topicDetail(topicId),
    queryFn: () => getTopicDetailApi(topicId),
    enabled: !!topicId,
  });
}
