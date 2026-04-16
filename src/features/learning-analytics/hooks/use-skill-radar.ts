import { useQuery } from "@tanstack/react-query";
import { getSkillRadarApi } from "../api";

export const learningAnalyticsQueryKeys = {
  skillRadar: () => ["learning-analytics", "skill-radar"] as const,
};

export function useSkillRadar() {
  return useQuery({
    queryKey: learningAnalyticsQueryKeys.skillRadar(),
    queryFn: getSkillRadarApi,
  });
}
