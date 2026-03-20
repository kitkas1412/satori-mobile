import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { FeedbackResultResponse } from "./speaking.types";

export async function completeSessionApi(
  sessionId: string,
): Promise<FeedbackResultResponse> {
  const response = await api.post<ApiResponse<FeedbackResultResponse>>(
    `/learner/roleplay/sessions/${sessionId}/complete`,
  );
  return response.data.data;
}
