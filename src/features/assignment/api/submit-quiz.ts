// Gọi API nộp bài trắc nghiệm (POST /learner/assignments/:id/submit-quiz).
// Body chứa danh sách đáp án (JSON string) và thời gian làm bài.

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { SubmitQuizRequest, SubmitQuizResponse } from "./assignment.types";

export async function submitQuizApi(
  assignmentId: string,
  body: SubmitQuizRequest,
): Promise<SubmitQuizResponse> {
  const response = await api.post<ApiResponse<SubmitQuizResponse>>(
    `/learner/assignments/${assignmentId}/submit-quiz`,
    body,
  );
  return response.data.data;
}
