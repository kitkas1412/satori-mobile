import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { SubmitQuizResponse } from "./practice.types";

export async function getSubmissionApi(
  submissionId: string,
): Promise<SubmitQuizResponse> {
  const response = await api.get<ApiResponse<SubmitQuizResponse>>(
    `/learner/assignments/submissions/${submissionId}`,
  );
  return response.data.data;
}
