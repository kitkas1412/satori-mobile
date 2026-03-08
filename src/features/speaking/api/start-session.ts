import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { RoleplaySession } from "./speaking.types";

export async function startSessionApi(topicId: string): Promise<RoleplaySession> {
  const response = await api.post<ApiResponse<RoleplaySession>>(
    "/learner/roleplay/sessions",
    { topicId }
  );
  return response.data.data;
}
