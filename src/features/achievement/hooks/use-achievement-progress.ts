import { useQuery } from "@tanstack/react-query";
import { getAchievementProgressApi } from "../api";
import { achievementQueryKeys } from "../utils";

export { achievementQueryKeys };

export function useAchievementProgress() {
  return useQuery({
    queryKey: achievementQueryKeys.progress(),
    queryFn: getAchievementProgressApi,
  });
}
