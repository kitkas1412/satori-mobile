import { useQuery } from "@tanstack/react-query";
import { getInsightsApi } from "../api";

export const insightsQueryKeys = {
  insights: () => ["learning-analytics", "insights"] as const,
};

export function useInsights() {
  return useQuery({
    queryKey: insightsQueryKeys.insights(),
    queryFn: getInsightsApi,
  });
}
