import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { AnswerRequest, AnswerResponse } from "./practice-with-ai.types";

export async function submitAnswerApi(
  sessionId: string,
  itemId: string,
  request: AnswerRequest,
): Promise<AnswerResponse> {
  const response = await api.post<ApiResponse<AnswerResponse>>(
    `/learner/practice/sessions/${sessionId}/items/${itemId}/answer`,
    request,
  );
  return response.data.data;
}
