// Gọi API lấy lịch sử streak của learner (GET /api/v1/learner/achievements/streaks/history).

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { StreakHistoryResponse } from "./streak.types";

export async function getStreakHistoryApi(
  days: number,
): Promise<StreakHistoryResponse> {
  const response = await api.get<ApiResponse<StreakHistoryResponse>>(
    "/learner/achievements/streaks/history",
    { params: { days } },
  );
  return response.data.data;
}
