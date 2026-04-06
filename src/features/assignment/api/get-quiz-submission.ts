// Gọi API lấy kết quả bài trắc nghiệm đã nộp (GET /learner/assignments/submissions/:id).
// Dùng khi học viên xem lại kết quả bài đã được chấm.

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { SubmitQuizResponse } from "./assignment.types";

export async function getQuizSubmissionApi(
  submissionId: string,
): Promise<SubmitQuizResponse> {
  const response = await api.get<ApiResponse<SubmitQuizResponse>>(
    `/learner/assignments/submissions/${submissionId}`,
  );
  return response.data.data;
}
