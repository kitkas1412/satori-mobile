import { useQuery } from "@tanstack/react-query";
import { getMasteryApi } from "../api";

export const masteryQueryKeys = {
  mastery: (courseId: string) =>
    ["learning-analytics", "mastery", courseId] as const,
};

export function useMastery(courseId: string | undefined) {
  return useQuery({
    queryKey: masteryQueryKeys.mastery(courseId ?? ""),
    queryFn: () => getMasteryApi(courseId!),
    enabled: !!courseId,
  });
}
