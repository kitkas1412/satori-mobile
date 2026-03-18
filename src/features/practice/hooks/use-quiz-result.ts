import { useRouter } from "expo-router";

import { usePracticeStore } from "@/stores";

export function useQuizResult() {
  const router = useRouter();
  const quizResult = usePracticeStore((s) => s.quizResult);
  const clearQuizResult = usePracticeStore((s) => s.clearQuizResult);

  if (!quizResult) return null;

  const accuracy =
    quizResult.totalQuestions > 0
      ? Math.round((quizResult.correctCount / quizResult.totalQuestions) * 100)
      : 0;
  const wrongCount = quizResult.totalQuestions - quizResult.correctCount;
  const performanceLabel =
    quizResult.score >= 80
      ? "Xuất sắc!"
      : quizResult.score >= 60
        ? "Tốt!"
        : "Cố lên!";

  function handleContinue() {
    clearQuizResult();
    router.replace("/(tabs)/practice");
  }

  return { quizResult, accuracy, wrongCount, performanceLabel, handleContinue };
}
