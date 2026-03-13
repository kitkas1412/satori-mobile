import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { TopicDetailResponse } from "./speaking.types";

export async function getTopicDetailApi(topicId: string): Promise<TopicDetailResponse> {
  const response = await api.get<ApiResponse<TopicDetailResponse>>(
    `/learner/conversation/topics/${topicId}`,
  );
  return response.data.data;
}
