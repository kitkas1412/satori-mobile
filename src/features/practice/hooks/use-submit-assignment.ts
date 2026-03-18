import { useMutation } from "@tanstack/react-query";
import { submitAssignmentApi } from "../api";
import type { SubmitQuizRequest } from "../api";

export function useSubmitAssignment() {
  return useMutation({
    mutationFn: ({
      assignmentId,
      body,
    }: {
      assignmentId: string;
      body: SubmitQuizRequest;
    }) => submitAssignmentApi(assignmentId, body),
  });
}
