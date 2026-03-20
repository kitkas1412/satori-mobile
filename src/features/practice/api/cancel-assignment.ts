import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { SubmitWritingResponse } from "./practice.types";

export async function cancelAssignmentApi(
  assignmentId: string,
): Promise<SubmitWritingResponse> {
  const response = await api.post<ApiResponse<SubmitWritingResponse>>(
    `/learner/assignments/${assignmentId}/cancel`,
  );
  return response.data.data;
}
