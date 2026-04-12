import { api } from "@/lib/axios";
import type { ApiResponse, LearningPreferences } from "@/types/api";

export async function getLearningPreferences(): Promise<LearningPreferences> {
  const response = await api.get<ApiResponse<LearningPreferences>>(
    "/profile/learning-preferences",
  );
  return response.data.data;
}
