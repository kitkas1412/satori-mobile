import { useMutation } from "@tanstack/react-query";
import { getPracticesApi } from "../api";
import type { PracticeSessionRequest, PracticeSessionResponse } from "../api/practice-with-ai.types";

export function usePracticeSession() {
  return useMutation<PracticeSessionResponse, Error, PracticeSessionRequest>({
    mutationFn: getPracticesApi,
    retry: 1,
  });
}
