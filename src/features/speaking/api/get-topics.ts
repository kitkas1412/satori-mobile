import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { TopicListResponse, Topic } from "./speaking.types";

export async function getTopicsApi(
  pageParam: number = 0,
): Promise<TopicListResponse<Topic>> {
  const response = await api.get<ApiResponse<TopicListResponse<Topic>>>(
    "/learner/conversation/themes",
    { params: { page: pageParam, size: 10 } },
  );
  return response.data.data;
}
