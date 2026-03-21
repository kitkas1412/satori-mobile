// Hook gọi API nộp bài trắc nghiệm.
// Wrap submitAssignmentApi thành mutation để màn hình theo dõi trạng thái đang nộp.

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
