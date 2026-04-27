import { useQuery } from "@tanstack/react-query";
import { getWeeklyProgressApi } from "../api";

export const weeklyProgressQueryKeys = {
  progress: () => ["learning-analytics", "weekly-progress"] as const,
};

export function useWeeklyProgress() {
  return useQuery({
    queryKey: weeklyProgressQueryKeys.progress(),
    queryFn: getWeeklyProgressApi,
  });
}
