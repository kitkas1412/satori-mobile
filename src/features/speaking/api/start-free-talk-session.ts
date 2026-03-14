import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { FreeTalkSessionRequest, RoleplaySessionResponse } from "./speaking.types";

export async function startFreeTalkSessionApi(
  request: FreeTalkSessionRequest,
): Promise<RoleplaySessionResponse> {
  const response = await api.post<ApiResponse<RoleplaySessionResponse>>(
    "/learner/roleplay/free-talk/sessions",
    request,
  );
  return response.data.data;
}
