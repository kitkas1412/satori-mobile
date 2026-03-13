import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { TopicResponse } from "./speaking.types";

export async function getTopicsApi(themeId: string): Promise<TopicResponse[]> {
  const response = await api.get<ApiResponse<TopicResponse[]>>(
    `/learner/conversation/themes/${themeId}/topics`,
  );
  return response.data.data;
}
