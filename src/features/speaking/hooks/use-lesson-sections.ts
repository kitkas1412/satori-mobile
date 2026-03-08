import { useQuery } from "@tanstack/react-query";
import { getThemesApi } from "../api";

export const speakingQueryKeys = {
  themes: ["speaking", "themes"] as const,
  topics: (themeId: string) => ["speaking", "topics", themeId] as const,
};

export function useLessonSections() {
  return useQuery({
    queryKey: speakingQueryKeys.themes,
    queryFn: getThemesApi,
  });
}
