import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { PracticeSessionSummaryResponse } from "./practice-with-ai.types";

export async function getPracticeSessionSummaryApi(
  practiceSessionId: string,
): Promise<PracticeSessionSummaryResponse> {
  const response = await api.get<ApiResponse<PracticeSessionSummaryResponse>>(
    `/learner/practice/sessions/${practiceSessionId}/summary`,
  );

  return response.data.data;
}
