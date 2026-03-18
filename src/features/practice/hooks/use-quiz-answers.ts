import { useState } from "react";

export function useQuizAnswers() {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  function handleSelectOption(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  function handleFillBlankChange(questionId: string, text: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
  }

  return { answers, handleSelectOption, handleFillBlankChange };
}
