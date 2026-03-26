import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { ConversationResponse } from "./speaking.types";

export async function getConversationsApi(topicId: string): Promise<ConversationResponse[]> {
  const response = await api.get<ApiResponse<ConversationResponse[]>>(
    `/learner/conversation/themes/${topicId}/topics`,
  );
  return response.data.data;
}
