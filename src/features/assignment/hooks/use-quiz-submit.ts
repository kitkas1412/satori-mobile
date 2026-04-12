// Hook tổng hợp toàn bộ logic nộp bài trắc nghiệm:
// build payload đáp án, tính thời gian, gọi API, lưu kết quả vào store và điều hướng.

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { useAssignmentStore } from "@/stores";
import type { Question } from "../api";
import { useSubmitAssignment } from "./use-submit-assignment";

interface UseQuizSubmitParams {
  assignmentId: string;
  questions: Question[];
  answers: Record<string, string>; // key: assignmentQuestionId, value: optionId hoặc text đã chọn
  getTimeStats: (total: number) => { timeSpentSeconds: number; timePerQuestion: number };
}

export function useQuizSubmit({
  assignmentId,
  questions,
  answers,
  getTimeStats,
}: UseQuizSubmitParams) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const submitMutation = useSubmitAssignment();
  const setQuizResult = useAssignmentStore((s) => s.setQuizResult);

  function handleSubmit() {
    const total = questions.length;
    const { timeSpentSeconds, timePerQuestion } = getTimeStats(total);

    // Build payload: với mỗi câu hỏi, lấy đáp án đã chọn (hoặc chuỗi rỗng nếu bỏ qua).
    // Dùng assignmentQuestionId làm key tra cứu vì answers được lưu theo key này.
    // timeSpent được tính trung bình đều cho tất cả câu vì không đo từng câu riêng lẻ.
    const answersPayload = questions.map((q) => ({
      questionId: q.questionId,
      selectedAnswer: answers[q.assignmentQuestionId] ?? "",
      timeSpent: timePerQuestion,
    }));

    submitMutation.mutate(
      {
        assignmentId,
        body: {
          answers: JSON.stringify(answersPayload), // API yêu cầu serialize thành chuỗi JSON
          timeSpentSeconds,
        },
      },
      {
        onSuccess: (result) => {
          // Lưu kết quả vào store để màn hình kết quả đọc mà không cần gọi API lại
          setQuizResult(assignmentId, result);
          // Làm mới danh sách bài tập để cập nhật trạng thái bài vừa nộp
          queryClient.invalidateQueries({ queryKey: ["assignments"] });
          router.push("/assignment-result");
        },
      },
    );
  }

  return { handleSubmit, isPending: submitMutation.isPending, isError: submitMutation.isError };
}
