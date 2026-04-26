import { useQuery } from "@tanstack/react-query";
import { getBadgeDetailApi } from "../api";
import { achievementQueryKeys } from "../utils";

export function useBadgeDetail(badgeId: string) {
  return useQuery({
    queryKey: achievementQueryKeys.badgeDetail(badgeId),
    queryFn: () => getBadgeDetailApi(badgeId),
    enabled: !!badgeId,
  });
}
