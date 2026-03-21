import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

import { usePracticeStore } from "@/stores";
import { cancelAssignmentApi } from "../api";

export function useWritingResult() {
  const router = useRouter();
  const writingResult = usePracticeStore((s) => s.writingResult);
  const clearWritingResult = usePracticeStore((s) => s.clearWritingResult);
  const [isCancelling, setIsCancelling] = useState(false);

  const isGraded = writingResult?.status === "GRADED";
  const imageUrls = writingResult?.imageUrls ?? [];
  const score = writingResult?.score ?? 0;

  function handleGoHome() {
    clearWritingResult();
    router.replace("/(tabs)/practice");
  }

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
              router.replace({
                pathname: "/assignment-writing",
                params: { id: writingResult.assignmentId },
              });
            } catch {
              Alert.alert("Lỗi", "Không thể hủy nộp bài. Vui lòng thử lại.");
            } finally {
              setIsCancelling(false);
            }
          },
        },
      ],
    );
  }

  return { writingResult, isGraded, imageUrls, score, isCancelling, handleGoHome, handleCancelSubmission };
}
