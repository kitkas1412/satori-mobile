import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  PracticeSessionRequest,
  PracticeSessionResponse,
} from "./practice-with-ai.types";

export async function getPracticesApi(
  request: PracticeSessionRequest,
): Promise<PracticeSessionResponse> {
  const response = await api.post<ApiResponse<PracticeSessionResponse>>(
    "/learner/practice/sessions",
    request,
  );
  return response.data.data;
}
