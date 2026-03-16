import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { AssignmentsPageData } from "./practice.types";

export async function getAssignmentsApi(): Promise<AssignmentsPageData> {
  const response = await api.get<ApiResponse<AssignmentsPageData>>(
    "/learner/assignments",
    { params: { page: 1, size: 10 } },
  );
  return response.data.data;
}
