// Gọi API lấy danh sách lớp học của học viên (GET /learner/classes).

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { LearnerClass } from "./assignment.types";

export async function getClassesApi(): Promise<LearnerClass[]> {
  const response = await api.get<ApiResponse<LearnerClass[]>>("/learner/classes");
  return response.data.data;
}
