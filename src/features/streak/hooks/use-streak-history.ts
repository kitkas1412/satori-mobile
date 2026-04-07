// Hook lấy lịch sử streak của learner bằng React Query.

import { useQuery } from "@tanstack/react-query";
import { getStreakHistoryApi } from "../api";
import { streakQueryKeys } from "./use-streak-current";

export function useStreakHistory(days = 7) {
  return useQuery({
    queryKey: streakQueryKeys.history(days),
    queryFn: () => getStreakHistoryApi(days),
  });
}
