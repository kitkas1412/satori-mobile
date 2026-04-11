// Gọi API lấy danh sách từ vựng và ngữ pháp của bài học (GET /api/v1/learner/practice/lessons/:lessonId/items).

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { LessonItemsResponse } from "./practice-with-ai.types";

export async function getLessonItemsApi(
  lessonId: string,
): Promise<LessonItemsResponse> {
  const response = await api.get<ApiResponse<LessonItemsResponse>>(
    `/learner/practice/lessons/${lessonId}/items`,
  );
  return response.data.data;
}
