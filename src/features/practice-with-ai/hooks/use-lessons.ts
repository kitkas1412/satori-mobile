// Hook lấy danh sách bài học theo khoá học bằng React Query.
// Query bị tắt (disabled) khi chưa có courseId.

import { useQuery } from "@tanstack/react-query";
import { getLessonsApi } from "../api";

export const practiceWithAiQueryKeys = {
  lessons: (courseId: string) =>
    ["practice-with-ai", "lessons", courseId] as const,
};

export function useLessons(courseId: string | undefined) {
  return useQuery({
    queryKey: practiceWithAiQueryKeys.lessons(courseId ?? ""),
    queryFn: () => getLessonsApi(courseId!),
    enabled: !!courseId,
  });
}
