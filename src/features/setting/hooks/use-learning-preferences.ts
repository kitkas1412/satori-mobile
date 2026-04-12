import { getLearningPreferences } from "@/features/setting/api";
import { useQuery } from "@tanstack/react-query";

export const learningPreferencesQueryKey = ["setting", "learningPreferences"] as const;

export function useLearningPreferences() {
  return useQuery({
    queryKey: learningPreferencesQueryKey,
    queryFn: getLearningPreferences,
  });
}
