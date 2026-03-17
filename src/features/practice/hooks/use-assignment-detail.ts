import { useQuery } from "@tanstack/react-query";
import { getAssignmentDetailApi } from "../api";

export function useAssignmentDetail(id: string) {
  return useQuery({
    queryKey: ["practice", "assignment", id],
    queryFn: () => getAssignmentDetailApi(id),
    enabled: !!id,
  });
}
