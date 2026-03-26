// Hook lấy danh sách bài tập của học viên bằng React Query.
// Khai báo practiceQueryKeys tập trung để các hook khác có thể invalidate cache khi cần.

import { useQuery } from "@tanstack/react-query";
import { getAssignmentsApi } from "../api";

// Query keys dùng chung cho tính năng Practice.
// Tập trung ở đây để tránh hard-code string nhiều chỗ và dễ invalidate theo nhóm.
export const practiceQueryKeys = {
  assignments: ["practice", "assignments"] as const,
};

export function useAssignments() {
  return useQuery({
    queryKey: practiceQueryKeys.assignments,
    queryFn: getAssignmentsApi,
  });
}
