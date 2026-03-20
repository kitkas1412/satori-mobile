import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { AssignmentDetailResponse } from "./practice.types";

export async function startAssignmentApi(
  id: string,
): Promise<AssignmentDetailResponse> {
  const response = await api.post<ApiResponse<AssignmentDetailResponse>>(
    `/learner/assignments/${id}/start`,
  );
  return response.data.data;
}
