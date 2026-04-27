// Hook lấy danh sách bài tập của học viên bằng React Query.
// Khai báo assignmentQueryKeys tập trung để các hook khác có thể invalidate cache khi cần.

import { useInfiniteQuery } from "@tanstack/react-query";
import { getAssignmentsApi } from "../api";
import type { LearnerSubmissionStatus } from "../api/assignment.types";

// Query keys dùng chung cho tính năng Assignment.
// Tập trung ở đây để tránh hard-code string nhiều chỗ và dễ invalidate theo nhóm.
// .all là base key để invalidate toàn bộ; .filtered dùng cho query cụ thể.
export const assignmentQueryKeys = {
  all: ["assignments"] as const,
  filtered: (status?: LearnerSubmissionStatus, classId?: string, lessonId?: string) =>
    ["assignments", status ?? "all", classId ?? "all", lessonId ?? "all"] as const,
};

export function useAssignments(
  status?: LearnerSubmissionStatus,
  classId?: string,
  lessonId?: string,
) {
  return useInfiniteQuery({
    queryKey: assignmentQueryKeys.filtered(status, classId, lessonId),
    queryFn: ({ pageParam }) => getAssignmentsApi(pageParam, status, classId, lessonId),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.pageNumber < lastPage.totalPages
        ? lastPage.pageNumber + 1
        : undefined,
  });
}
