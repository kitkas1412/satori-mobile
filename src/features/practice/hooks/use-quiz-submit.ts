import { Alert } from "react-native";
import { useRouter } from "expo-router";

import { usePracticeStore } from "@/stores";
import type { Question } from "../api";
import { useSubmitAssignment } from "./use-submit-assignment";

interface UseQuizSubmitParams {
  assignmentId: string;
  questions: Question[];
  answers: Record<string, string>;
  getTimeStats: (total: number) => { timeSpentSeconds: number; timePerQuestion: number };
}

export function useQuizSubmit({
  assignmentId,
  questions,
  answers,
  getTimeStats,
}: UseQuizSubmitParams) {
  const router = useRouter();
  const submitMutation = useSubmitAssignment();
  const setQuizResult = usePracticeStore((s) => s.setQuizResult);

  function handleSubmit() {
    const total = questions.length;
    const { timeSpentSeconds, timePerQuestion } = getTimeStats(total);

    const answersPayload = questions.map((q) => ({
      questionId: q.questionId,
      selectedAnswer: answers[q.assignmentQuestionId] ?? "",
      timeSpent: timePerQuestion,
    }));

    submitMutation.mutate(
      {
        assignmentId,
        body: {
          answers: JSON.stringify(answersPayload),
          timeSpentSeconds,
        },
      },
      {
        onSuccess: (result) => {
          setQuizResult(assignmentId, result);
          router.push("/assignment-result");
        },
        onError: () => {
          Alert.alert("Lỗi", "Không thể nộp bài. Vui lòng thử lại.");
        },
      },
    );
  }

  return { handleSubmit, isPending: submitMutation.isPending, isError: submitMutation.isError };
}
