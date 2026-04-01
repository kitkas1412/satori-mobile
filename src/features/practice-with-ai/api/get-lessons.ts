// Gọi API lấy danh sách bài học theo khoá học (GET /api/v1/courses/{courseId}/lessons).

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Lesson } from "./practice-with-ai.types";

export async function getLessonsApi(courseId: string): Promise<Lesson[]> {
  const response = await api.get<ApiResponse<Lesson[]>>(
    `/courses/${courseId}/lessons`,
  );
  return response.data.data;
}
