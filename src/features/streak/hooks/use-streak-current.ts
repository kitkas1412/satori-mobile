// Hook lấy streak hiện tại của learner bằng React Query.

import { useQuery } from "@tanstack/react-query";
import { getStreakCurrentApi } from "../api";

export const streakQueryKeys = {
  current: ["streak", "current"] as const,
  history: (days: number) => ["streak", "history", days] as const,
};

export function useStreakCurrent() {
  return useQuery({
    queryKey: streakQueryKeys.current,
    queryFn: getStreakCurrentApi,
  });
}
