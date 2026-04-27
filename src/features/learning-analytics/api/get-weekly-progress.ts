import { api } from "@/lib/axios";
import type { WeeklyProgressData, WeeklyProgressResponse } from "./learning-analytics.types";

const WEEKS = 8;

export async function getWeeklyProgressApi(): Promise<WeeklyProgressData> {
  const response = await api.get<WeeklyProgressResponse>(
    `/learner/stats/progress?weeks=${WEEKS}`,
  );
  return response.data.data;
}
