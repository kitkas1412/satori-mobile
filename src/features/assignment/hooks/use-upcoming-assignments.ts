import { useQuery } from "@tanstack/react-query";
import { getAssignmentsApi } from "../api";
import type { Content } from "../api/assignment.types";

const PENDING_STATUSES = new Set(["NOT_STARTED", "IN_PROGRESS"]);

export function useUpcomingAssignments() {
  return useQuery({
    queryKey: ["assignments", "upcoming"] as const,
    queryFn: async (): Promise<Content[]> => {
      const data = await getAssignmentsApi(1, undefined, undefined, undefined, 3);
      const pending = data.content.filter((a) =>
        PENDING_STATUSES.has(a.learnerSubmissionStatus),
      );
      if (pending.length === 0) return [];
      const nearestDueDate = pending[0].dueDate;
      return pending.filter((a) => a.dueDate === nearestDueDate);
    },
  });
}
