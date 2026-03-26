// Hook quản lý state đáp án học viên đang chọn trong bài trắc nghiệm.
// Lưu theo dạng map: assignmentQuestionId → optionId (hoặc text nếu là fill_blank).

import { useState } from "react";

export function useQuizAnswers() {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Cập nhật đáp án khi học viên chọn một lựa chọn trong câu trắc nghiệm
  function handleSelectOption(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  // Cập nhật đáp án khi học viên gõ vào ô điền vào chỗ trống
  function handleFillBlankChange(questionId: string, text: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
  }

  return { answers, handleSelectOption, handleFillBlankChange };
}
