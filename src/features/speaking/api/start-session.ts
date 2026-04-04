import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { RoleplaySessionResponse } from "./speaking.types";

export async function startSessionApi(
  conversationId: string,
): Promise<RoleplaySessionResponse> {
  const response = await api.post<ApiResponse<RoleplaySessionResponse>>(
    "/learner/roleplay/sessions",
    { conversationId },
  );
  return response.data.data;
}
