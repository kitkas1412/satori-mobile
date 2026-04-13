import { useQuery } from "@tanstack/react-query";
import { getAchievementProgressApi } from "../api";

export const achievementQueryKeys = {
  progress: () => ["achievement", "progress"] as const,
  badges: () => ["achievement", "badges"] as const,
};

export function useAchievementProgress() {
  return useQuery({
    queryKey: achievementQueryKeys.progress(),
    queryFn: getAchievementProgressApi,
  });
}
