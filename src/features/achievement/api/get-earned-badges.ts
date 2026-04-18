import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { EarnedBadge } from "./achievement.types";

export async function getEarnedBadgesApi(): Promise<EarnedBadge[]> {
  const response = await api.get<ApiResponse<EarnedBadge[]>>(
    "/learner/achievements",
  );
  return response.data.data;
}
