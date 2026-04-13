import { api } from "@/lib/axios";
import type { ApiResponse, LearningPreferences } from "@/types/api";

export async function updateLearningPreferences(
  data: Partial<LearningPreferences>,
): Promise<LearningPreferences> {
  const response = await api.put<ApiResponse<LearningPreferences>>(
    "/profile/learning-preferences",
    data,
  );
  return response.data.data;
}
