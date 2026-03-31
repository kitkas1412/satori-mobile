// Gọi API lấy danh sách bài tập của học viên (GET /learner/assignments).
// Lấy trang đầu tiên với 10 bài tập mỗi trang.

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { AssignmentsResponse, LearnerSubmissionStatus } from "./practice.types";

export async function getAssignmentsApi(
  pageParam: number = 1,
  status?: LearnerSubmissionStatus,
): Promise<AssignmentsResponse> {
  const params: Record<string, unknown> = { page: pageParam, size: 10 };
  if (status) params.status = status;
  const response = await api.get<ApiResponse<AssignmentsResponse>>(
    "/learner/assignments",
    { params },
  );
  return response.data.data;
}
