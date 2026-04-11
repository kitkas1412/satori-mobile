import { useQuery } from "@tanstack/react-query";
import { getAchievementProgressApi } from "../api";

export const achievementProgressQueryKey = ["achievement-progress"] as const;

export function useAchievementProgress() {
  return useQuery({
    queryKey: achievementProgressQueryKey,
    queryFn: getAchievementProgressApi,
  });
}
