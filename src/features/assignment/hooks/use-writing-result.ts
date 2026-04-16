// Hook đọc kết quả bài viết từ store và xử lý các hành động trên màn hình kết quả:
// quay về trang chủ hoặc hủy nộp bài để làm lại.

import { useState } from "react";
import { Alert } from "react-native";

import { useAssignmentStore } from "@/stores";
import { extractApiError } from "@/lib/extract-api-error";
import { useErrorOverlayStore } from "@/stores/error-overlay-store";
import { cancelAssignmentApi } from "../api";

interface UseWritingResultParams {
  onNavigate: (pathname: string, params?: Record<string, string>) => void;
}

export function useWritingResult({ onNavigate }: UseWritingResultParams) {
  const writingResult = useAssignmentStore((s) => s.writingResult);
  const clearWritingResult = useAssignmentStore((s) => s.clearWritingResult);
  const isReview = useAssignmentStore((s) => s.isReview);
  const [isCancelling, setIsCancelling] = useState(false);

  const isGraded = writingResult?.status === "GRADED";
  const imageUrls = writingResult?.imageUrls ?? [];
  const score = writingResult?.score ?? 0;

  function handleContinue() {
    clearWritingResult();
    onNavigate("/(tabs)/practice");
  }

  // Hiển thị xác nhận trước khi hủy nộp bài.
  // Sau khi hủy thành công: xóa store và điều hướng lại màn hình làm bài để học viên nộp lại.
  function handleCancelSubmission() {
    Alert.alert(
      "Hủy nộp bài?",
      "Nếu hủy nộp bài, bạn sẽ phải làm lại từ đầu.",
      [
        { text: "Giữ lại", style: "cancel" },
        {
          text: "Hủy nộp bài",
          style: "destructive",
          onPress: async () => {
            if (!writingResult?.assignmentId) return;
            try {
              setIsCancelling(true);
              await cancelAssignmentApi(writingResult.assignmentId);
              clearWritingResult();
              onNavigate("/assignment-writing", { id: writingResult.assignmentId });
            } catch (error) {
              useErrorOverlayStore.getState().show(extractApiError(error));
            } finally {
              setIsCancelling(false);
            }
          },
        },
      ],
    );
  }

  return { writingResult, isGraded, imageUrls, score, isCancelling, handleContinue, handleCancelSubmission, isReview };
}
