// Hook đọc kết quả bài trắc nghiệm từ store, tính nhãn đánh giá và xử lý điều hướng về trang chủ.
// Trả về null nếu chưa có kết quả trong store (màn hình sẽ không render gì).

import { useRouter } from "expo-router";

import { usePracticeStore } from "@/stores";

export function useQuizResult() {
  const router = useRouter();
  const quizResult = usePracticeStore((s) => s.quizResult);
  const clearQuizResult = usePracticeStore((s) => s.clearQuizResult);

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

  // Xóa kết quả khỏi store và quay về tab Practice
  function handleContinue() {
    clearQuizResult();
    router.replace("/(tabs)/practice");
  }

  return { quizResult, wrongCount, performanceLabel, handleContinue };
}
