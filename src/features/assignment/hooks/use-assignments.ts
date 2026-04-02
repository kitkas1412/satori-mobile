// Hook lấy danh sách bài tập của học viên bằng React Query.
// Khai báo practiceQueryKeys tập trung để các hook khác có thể invalidate cache khi cần.

import { useInfiniteQuery } from "@tanstack/react-query";
import { getAssignmentsApi } from "../api";
import type { LearnerSubmissionStatus } from "../api/practice.types";

// Query keys dùng chung cho tính năng Practice.
// Tập trung ở đây để tránh hard-code string nhiều chỗ và dễ invalidate theo nhóm.
export const practiceQueryKeys = {
  assignments: (status?: LearnerSubmissionStatus) =>
    ["practice", "assignments", status ?? "all"] as const,
};

export function useAssignments(status?: LearnerSubmissionStatus) {
  return useInfiniteQuery({
    queryKey: practiceQueryKeys.assignments(status),
    queryFn: ({ pageParam }) => getAssignmentsApi(pageParam, status),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.pageNumber + 1,
  });
}
