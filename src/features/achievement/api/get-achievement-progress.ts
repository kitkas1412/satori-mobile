import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { AchievementProgress } from "./achievement.types";

export async function getAchievementProgressApi(): Promise<AchievementProgress> {
  const response = await api.get<ApiResponse<AchievementProgress>>(
    "/learner/achievements/progress"
  );
  return response.data.data;
}
