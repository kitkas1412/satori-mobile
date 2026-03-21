import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { SubmitQuizRequest, SubmitQuizResponse } from "./practice.types";

export async function submitAssignmentApi(
  assignmentId: string,
  body: SubmitQuizRequest,
): Promise<SubmitQuizResponse> {
  const response = await api.post<ApiResponse<SubmitQuizResponse>>(
    `/learner/assignments/${assignmentId}/submit-quiz`,
    body,
  );
  return response.data.data;
}
