// Hook tổng hợp toàn bộ logic nộp bài trắc nghiệm:
// build payload đáp án, tính thời gian, gọi API, lưu kết quả vào store và gọi callback điều hướng.

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAssignmentStore } from "@/stores";
import { selectSetQuizResult } from "@/stores/assignment-store";
import { assignmentQueryKeys } from "./use-assignments";
import type { Question } from "../api";
import { submitQuizApi } from "../api";

interface UseQuizSubmitParams {
  assignmentId: string;
  questions: Question[];
  answers: Record<string, string>; // key: assignmentQuestionId, value: optionId hoặc text đã chọn
  onNavigate: () => void;
}

export function useQuizSubmit({
  assignmentId,
  questions,
  answers,
  onNavigate,
}: UseQuizSubmitParams) {
  const queryClient = useQueryClient();
  const submitMutation = useMutation({
    mutationFn: (body: { answers: string }) =>
      submitQuizApi(assignmentId, body),
  });
  const setQuizResult = useAssignmentStore(selectSetQuizResult);

  function handleSubmit() {
    // Build payload: với mỗi câu hỏi, lấy đáp án đã chọn (hoặc chuỗi rỗng nếu bỏ qua).
    // Dùng assignmentQuestionId làm key tra cứu vì answers được lưu theo key này.
    const answersPayload = questions.map((q) => ({
      questionId: q.questionId,
      selectedAnswer: answers[q.assignmentQuestionId] ?? "",
    }));

    submitMutation.mutate(
      {
        answers: JSON.stringify(answersPayload), // API yêu cầu serialize thành chuỗi JSON
      },
      {
        onSuccess: (result) => {
          // Lưu kết quả vào store để màn hình kết quả đọc mà không cần gọi API lại
          setQuizResult(assignmentId, result);
          // Làm mới danh sách bài tập để cập nhật trạng thái bài vừa nộp
          queryClient.invalidateQueries({ queryKey: assignmentQueryKeys.all });
          onNavigate();
        },
      },
    );
  }

  return { handleSubmit, isPending: submitMutation.isPending, isError: submitMutation.isError };
}
