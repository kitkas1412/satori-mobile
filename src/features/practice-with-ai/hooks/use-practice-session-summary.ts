import { useQuery } from "@tanstack/react-query";
import { getPracticeSessionSummaryApi } from "../api";

export const practiceSessionSummaryQueryKeys = {
  detail: (practiceSessionId: string) =>
    ["practice-with-ai", "session-summary", practiceSessionId] as const,
};

export function usePracticeSessionSummary(
  practiceSessionId: string | undefined,
) {
  return useQuery({
    queryKey: practiceSessionSummaryQueryKeys.detail(practiceSessionId ?? ""),
    queryFn: () => getPracticeSessionSummaryApi(practiceSessionId!),
    enabled: !!practiceSessionId,
  });
}
