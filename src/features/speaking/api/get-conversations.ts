import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { ConversationResponse } from "./speaking.types";

export async function getConversationsApi(topicId: string): Promise<ConversationResponse[]> {
  const response = await api.get<ApiResponse<ConversationResponse[]>>(
    `/learner/conversation/topics/${topicId}/conversations`,
  );
  return response.data.data;
}
