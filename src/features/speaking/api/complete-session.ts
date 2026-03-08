import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { FeedbackResult } from "./speaking.types";

export async function completeSessionApi(sessionId: string): Promise<FeedbackResult> {
  const response = await api.post<ApiResponse<FeedbackResult>>(
    `/learner/roleplay/sessions/${sessionId}/complete`
  );
  return response.data.data;
}
