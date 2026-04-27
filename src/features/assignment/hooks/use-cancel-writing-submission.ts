import { useState } from "react";
import { Alert } from "react-native";

import { extractApiError } from "@/lib/extract-api-error";
import { useErrorOverlayStore } from "@/stores/error-overlay-store";
import { cancelAssignmentApi } from "../api";

interface UseCancelWritingSubmissionParams {
  assignmentId: string | undefined;
  onSuccess: () => void;
  onNavigateResubmit: (assignmentId: string) => void;
}

export function useCancelWritingSubmission({
  assignmentId,
  onSuccess,
  onNavigateResubmit,
}: UseCancelWritingSubmissionParams) {
  const [isCancelling, setIsCancelling] = useState(false);

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
            if (!assignmentId) return;
            try {
              setIsCancelling(true);
              await cancelAssignmentApi(assignmentId);
              onSuccess();
              onNavigateResubmit(assignmentId);
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

  return { isCancelling, handleCancelSubmission };
}
