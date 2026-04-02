import { useMutation } from "@tanstack/react-query";
import { submitAnswerApi } from "../api";
import type { AnswerResponse } from "../api/practice-with-ai.types";

interface SubmitAnswerVariables {
  sessionId: string;
  itemId: string;
  userAnswer: string;
}

export function useSubmitAnswer() {
  return useMutation<AnswerResponse, Error, SubmitAnswerVariables>({
    mutationFn: ({ sessionId, itemId, userAnswer }) =>
      submitAnswerApi(sessionId, itemId, { userAnswer }),
  });
}
