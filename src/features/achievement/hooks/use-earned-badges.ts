import { useQuery } from "@tanstack/react-query";
import { getEarnedBadgesApi } from "../api";
import { achievementQueryKeys } from "./use-achievement-progress";

export function useEarnedBadges() {
  return useQuery({
    queryKey: achievementQueryKeys.earnedBadges(),
    queryFn: getEarnedBadgesApi,
  });
}
