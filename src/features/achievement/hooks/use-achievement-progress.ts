import { useQuery } from "@tanstack/react-query";
import { getAchievementProgressApi } from "../api";

export const achievementQueryKeys = {
  progress: () => ["achievement", "progress"] as const,
  badges: () => ["achievement", "badges"] as const,
  earnedBadges: () => ["achievement", "earned-badges"] as const,
  badgeDetail: (id: string) => ["achievement", "badge", id] as const,
};

export function useAchievementProgress() {
  return useQuery({
    queryKey: achievementQueryKeys.progress(),
    queryFn: getAchievementProgressApi,
  });
}
