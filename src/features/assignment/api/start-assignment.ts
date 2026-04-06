// Gọi API bắt đầu một bài tập (POST /learner/assignments/:id/start).
// Server trả về thông tin chi tiết bài tập bao gồm danh sách câu hỏi hoặc nội dung bài viết.

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { AssignmentDetailResponse } from "./assignment.types";

export async function startAssignmentApi(
  id: string,
): Promise<AssignmentDetailResponse> {
  const response = await api.post<ApiResponse<AssignmentDetailResponse>>(
    `/learner/assignments/${id}/start`,
  );
  return response.data.data;
}
