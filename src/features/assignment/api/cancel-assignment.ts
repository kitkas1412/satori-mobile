// Gọi API hủy nộp bài tập (POST /learner/assignments/:id/cancel).
// Dùng khi học viên muốn rút lại bài đã nộp và làm lại từ đầu.

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { SubmitWritingResponse } from "./assignment.types";

export async function cancelAssignmentApi(
  assignmentId: string,
): Promise<SubmitWritingResponse> {
  const response = await api.post<ApiResponse<SubmitWritingResponse>>(
    `/learner/assignments/${assignmentId}/cancel`,
  );
  return response.data.data;
}
