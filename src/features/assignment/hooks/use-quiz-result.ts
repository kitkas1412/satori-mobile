// Hook đọc kết quả bài trắc nghiệm từ store, tính nhãn đánh giá và xử lý điều hướng về trang chủ.
// Trả về null nếu chưa có kết quả trong store (màn hình sẽ không render gì).

import { useRouter } from "expo-router";

import { useAssignmentStore } from "@/stores";

export function useQuizResult() {
  const router = useRouter();
  const quizResult = useAssignmentStore((s) => s.quizResult);
  const clearQuizResult = useAssignmentStore((s) => s.clearQuizResult);
  const isReview = useAssignmentStore((s) => s.isReview);

  if (!quizResult) return null;

  const wrongCount = quizResult.totalQuestions - quizResult.correctCount;

  // Nhãn đánh giá dựa trên ngưỡng điểm:
  // >= 80: Xuất sắc | >= 60: Tốt | < 60: Cố lên
  const performanceLabel =
    quizResult.score >= 80
      ? "Xuất sắc!"
      : quizResult.score >= 60
        ? "Tốt!"
        : "Cố lên!";

  // Khi xem lại bài đã chấm → clear store và về tab Practice (không hiện reward).
  // Khi vừa submit xong → kiểm tra reward trước khi về.
  function handleContinue() {
    if (isReview) {
      clearQuizResult();
      router.replace("/(tabs)/practice");
      return;
    }

    const hasReward =
      quizResult.newBadgesEarned.length > 0 ||
      quizResult.levelUp !== null ||
      quizResult.streakNotification?.is_first_activity_today === true;

    if (hasReward) {
      router.replace("/assignment-reward");
    } else {
      clearQuizResult();
      router.replace("/(tabs)/practice");
    }
  }

  return { quizResult, wrongCount, performanceLabel, handleContinue, isReview };
}
