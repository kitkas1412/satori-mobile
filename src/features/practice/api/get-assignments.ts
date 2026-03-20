import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { AssignmentsResponse } from "./practice.types";

export async function getAssignmentsApi(): Promise<AssignmentsResponse> {
  const response = await api.get<ApiResponse<AssignmentsResponse>>(
    "/learner/assignments",
    { params: { page: 1, size: 10 } },
  );
  return response.data.data;
}
