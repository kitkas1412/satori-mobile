import { updateLearningPreferences } from "@/features/setting/api";
import { learningPreferencesQueryKey } from "@/features/setting/hooks/use-learning-preferences";
import type { LearningPreferences } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateLearningPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<LearningPreferences>) => {
      const cached = queryClient.getQueryData<LearningPreferences>(
        learningPreferencesQueryKey,
      );
      return updateLearningPreferences({ ...cached, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: learningPreferencesQueryKey });
    },
  });
}
