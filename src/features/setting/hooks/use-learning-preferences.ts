import { getLearningPreferences } from "@/features/setting/api";
import { useQuery } from "@tanstack/react-query";

export const learningPreferencesQueryKeys = {
  all: ["setting", "learningPreferences"] as const,
  filtered: () => [...learningPreferencesQueryKeys.all] as const,
};

export function useLearningPreferences() {
  return useQuery({
    queryKey: learningPreferencesQueryKeys.all,
    queryFn: getLearningPreferences,
  });
}
