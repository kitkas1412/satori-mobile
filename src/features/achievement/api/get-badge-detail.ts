import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { BadgeDetail } from "./achievement.types";

export async function getBadgeDetailApi(badgeId: string): Promise<BadgeDetail> {
  const response = await api.get<ApiResponse<BadgeDetail>>(
    `/learner/achievements/badges/${badgeId}`,
  );
  return response.data.data;
}
