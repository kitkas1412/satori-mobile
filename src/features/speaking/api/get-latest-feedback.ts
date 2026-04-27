import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { FeedbackResultResponse } from "./speaking.types";

export async function getLatestFeedbackApi(
  conversationId: string,
): Promise<FeedbackResultResponse> {
  const response = await api.get<ApiResponse<FeedbackResultResponse>>(
    `/learner/roleplay/conversations/${conversationId}/latest-feedback`,
  );
  return response.data.data;
}
