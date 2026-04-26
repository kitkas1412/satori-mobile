import { useInfiniteQuery } from "@tanstack/react-query";
import { getBadgesApi } from "../api";
import { achievementQueryKeys } from "../utils";

export function useBadges() {
  return useInfiniteQuery({
    queryKey: achievementQueryKeys.badges(),
    queryFn: ({ pageParam }) => getBadgesApi(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { number, totalPages } = lastPage.page;
      return number + 1 < totalPages ? number + 1 : undefined;
    },
  });
}
