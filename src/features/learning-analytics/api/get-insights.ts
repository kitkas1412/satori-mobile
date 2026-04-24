import { api } from "@/lib/axios";
import type { InsightsData, InsightsResponse } from "./learning-analytics.types";

export async function getInsightsApi(): Promise<InsightsData> {
  const response = await api.get<InsightsResponse>("/learner/stats/insights");
  return response.data.data;
}
