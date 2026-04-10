import { useInfiniteQuery } from "@tanstack/react-query";
import { getBadgesApi } from "../api";

export const badgesQueryKey = ["badges"] as const;

export function useBadges() {
  return useInfiniteQuery({
    queryKey: badgesQueryKey,
    queryFn: ({ pageParam }) => getBadgesApi(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
  });
}
