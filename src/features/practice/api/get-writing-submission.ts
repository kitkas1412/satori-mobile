import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { SubmitWritingResponse } from "./practice.types";

export async function getWritingSubmissionApi(
  submissionId: string,
): Promise<SubmitWritingResponse> {
  const response = await api.get<ApiResponse<SubmitWritingResponse>>(
    `/learner/assignments/submissions/${submissionId}`,
  );
  return response.data.data;
}
