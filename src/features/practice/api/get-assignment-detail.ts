import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { AssignmentDetail } from "./practice.types";

export async function getAssignmentDetailApi(id: string): Promise<AssignmentDetail> {
  const response = await api.get<ApiResponse<AssignmentDetail>>(
    `/learner/assignments/${id}`,
  );
  return response.data.data;
}
