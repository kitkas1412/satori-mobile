import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { TopicListResponse, Topic } from "./speaking.types";

export async function getTopicsApi(): Promise<Topic[]> {
  const response = await api.get<ApiResponse<TopicListResponse<Topic>>>(
    "/learner/conversation/themes",
  );
  return response.data.data.content;
}
