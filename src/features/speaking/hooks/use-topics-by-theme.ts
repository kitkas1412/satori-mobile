import { useQuery } from "@tanstack/react-query";
import { getTopicsApi } from "../api";
import { speakingQueryKeys } from "./use-lesson-sections";

export function useTopicsByTheme(themeId: string) {
  return useQuery({
    queryKey: speakingQueryKeys.topics(themeId),
    queryFn: () => getTopicsApi(themeId),
  });
}
