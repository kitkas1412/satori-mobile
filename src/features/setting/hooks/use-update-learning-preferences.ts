import { updateLearningPreferences } from "@/features/setting/api";
import { learningPreferencesQueryKeys } from "@/features/setting/hooks/use-learning-preferences";
import type { LearningPreferences } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateLearningPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<LearningPreferences>) => {
      const cached = queryClient.getQueryData<LearningPreferences>(
        learningPreferencesQueryKeys.all,
      );
      return updateLearningPreferences({ ...cached, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: learningPreferencesQueryKeys.all });
    },
  });
}
