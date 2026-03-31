// Gọi API lấy danh sách bài tập của học viên (GET /learner/assignments).
// Lấy trang đầu tiên với 10 bài tập mỗi trang.

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { AssignmentsResponse } from "./practice.types";

export async function getAssignmentsApi(
  pageParam: number = 1,
): Promise<AssignmentsResponse> {
  const response = await api.get<ApiResponse<AssignmentsResponse>>(
    "/learner/assignments",
    { params: { page: pageParam, size: 10 } },
  );
  return response.data.data;
}
