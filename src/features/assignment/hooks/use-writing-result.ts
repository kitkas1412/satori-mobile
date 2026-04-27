// Hook đọc kết quả bài viết từ store và xử lý các hành động trên màn hình kết quả:
// quay về trang chủ hoặc hủy nộp bài để làm lại.

import { useAssignmentStore } from "@/stores";
import { selectWritingResult, selectClearWritingResult, selectIsReview, selectWritingDueDate } from "@/stores/assignment-store";
import { useCancelWritingSubmission } from "./use-cancel-writing-submission";

interface UseWritingResultParams {
  onNavigate: (pathname: string, params?: Record<string, string>) => void;
}

export function useWritingResult({ onNavigate }: UseWritingResultParams) {
  const writingResult = useAssignmentStore(selectWritingResult);
  const clearWritingResult = useAssignmentStore(selectClearWritingResult);
  const isReview = useAssignmentStore(selectIsReview);
  const writingDueDate = useAssignmentStore(selectWritingDueDate);

  const isGraded = writingResult?.status === "GRADED";
  const isPastDeadline = writingDueDate ? new Date() > new Date(writingDueDate) : false;
  const imageUrls = writingResult?.imageUrls ?? [];
  const score = writingResult?.score ?? 0;

  function handleContinue() {
    clearWritingResult();
    onNavigate("/(tabs)/assignment");
  }

  const { isCancelling, handleCancelSubmission } = useCancelWritingSubmission({
    assignmentId: writingResult?.assignmentId,
    onSuccess: clearWritingResult,
    onNavigateResubmit: (id) => onNavigate("/assignment-writing", { id }),
  });

  return { writingResult, isGraded, isPastDeadline, imageUrls, score, isCancelling, handleContinue, handleCancelSubmission, isReview };
}
