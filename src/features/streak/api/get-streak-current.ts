// Gọi API lấy streak hiện tại của learner (GET /api/v1/learner/achievements/streaks/current).

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { CurrentStreakResponse } from "./streak.types";

export async function getStreakCurrentApi(): Promise<CurrentStreakResponse> {
  const response = await api.get<ApiResponse<CurrentStreakResponse>>(
    "/learner/achievements/streaks/current",
  );
  return response.data.data;
}
