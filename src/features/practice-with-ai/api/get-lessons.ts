// Gọi API lấy danh sách bài học theo khoá học (GET /api/v1/courses/{courseId}/lessons).

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { LessonResponse } from "./practice-with-ai.types";

export async function getLessonsApi(
  courseId: string,
): Promise<LessonResponse[]> {
  const response = await api.get<ApiResponse<LessonResponse[]>>(
    `/courses/${courseId}/lessons`,
  );
  return response.data.data;
}
