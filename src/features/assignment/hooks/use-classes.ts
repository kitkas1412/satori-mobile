// Hook lấy danh sách lớp học của học viên bằng React Query.

import { useQuery } from "@tanstack/react-query";
import { getClassesApi } from "../api";

export function useClasses() {
  return useQuery({
    queryKey: ["learner", "classes"],
    queryFn: getClassesApi,
  });
}
