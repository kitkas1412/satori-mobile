import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { RoleplaySessionResponse } from "./speaking.types";

export async function startSessionApi(
  topicId: string,
): Promise<RoleplaySessionResponse> {
  const response = await api.post<ApiResponse<RoleplaySessionResponse>>(
    "/learner/roleplay/sessions",
    { topicId },
  );
  return response.data.data;
}
