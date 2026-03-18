import { useRouter } from "expo-router";

import { usePracticeStore } from "@/stores";

export function useQuizResult() {
  const router = useRouter();
  const quizResult = usePracticeStore((s) => s.quizResult);
  const clearQuizResult = usePracticeStore((s) => s.clearQuizResult);

  if (!quizResult) return null;

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

  return { quizResult, wrongCount, performanceLabel, handleContinue };
}
