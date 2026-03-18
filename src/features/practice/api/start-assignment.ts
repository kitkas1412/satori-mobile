import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { AssignmentDetail } from "./practice.types";

export async function startAssignmentApi(id: string): Promise<AssignmentDetail> {
  const response = await api.post<ApiResponse<AssignmentDetail>>(
    `/learner/assignments/${id}/start`,
  );
  return response.data.data;
}
