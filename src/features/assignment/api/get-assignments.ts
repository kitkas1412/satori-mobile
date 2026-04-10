// Gọi API lấy danh sách bài tập của học viên (GET /learner/assignments).
// Lấy trang đầu tiên với 10 bài tập mỗi trang.

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { AssignmentsResponse, LearnerSubmissionStatus } from "./assignment.types";

export async function getAssignmentsApi(
  pageParam: number = 1,
  status?: LearnerSubmissionStatus,
  classId?: string,
  size: number = 10,
): Promise<AssignmentsResponse> {
  const params: Record<string, unknown> = { page: pageParam, size };
  if (status) params.status = status;
  if (classId) params.classId = classId;
  const response = await api.get<ApiResponse<AssignmentsResponse>>(
    "/learner/assignments",
    { params },
  );
  return response.data.data;
}
