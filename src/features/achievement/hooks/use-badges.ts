import { useInfiniteQuery } from "@tanstack/react-query";
import { getBadgesApi } from "../api";
import { achievementQueryKeys } from "./use-achievement-progress";

export function useBadges() {
  return useInfiniteQuery({
    queryKey: achievementQueryKeys.badges(),
    queryFn: ({ pageParam }) => getBadgesApi(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
  });
}
