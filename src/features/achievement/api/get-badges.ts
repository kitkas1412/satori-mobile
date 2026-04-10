import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { BadgesPage } from "./achievement.types";

export async function getBadgesApi(
  page = 0,
  size = 10,
): Promise<BadgesPage> {
  const response = await api.get<ApiResponse<BadgesPage>>(
    "/learner/achievements/badges",
    { params: { page, size } },
  );
  return response.data.data;
}
