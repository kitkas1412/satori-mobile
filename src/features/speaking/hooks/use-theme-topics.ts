import { useQuery } from "@tanstack/react-query";
import { getTopicsApi } from "../api";
import { speakingQueryKeys } from "./use-conversation-themes";

export function useThemeTopics(themeId: string) {
  return useQuery({
    queryKey: speakingQueryKeys.topics(themeId),
    queryFn: () => getTopicsApi(themeId),
  });
}
