import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { ConversationTopic } from "./speaking.types";

export async function getTopicsApi(themeId: string): Promise<ConversationTopic[]> {
  const response = await api.get<ApiResponse<ConversationTopic[]>>(
    `/learner/conversation/themes/${themeId}/topics`
  );
  return response.data.data;
}
