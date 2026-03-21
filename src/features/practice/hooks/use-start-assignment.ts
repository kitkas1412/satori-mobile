import { useMutation } from "@tanstack/react-query";
import { startAssignmentApi } from "../api";

export function useStartAssignment() {
  return useMutation({
    mutationFn: (id: string) => startAssignmentApi(id),
  });
}
