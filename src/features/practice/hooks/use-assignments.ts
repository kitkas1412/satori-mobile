import { useQuery } from "@tanstack/react-query";
import { getAssignmentsApi } from "../api";

export const practiceQueryKeys = {
  assignments: ["practice", "assignments"] as const,
};

export function useAssignments() {
  return useQuery({
    queryKey: practiceQueryKeys.assignments,
    queryFn: getAssignmentsApi,
  });
}
