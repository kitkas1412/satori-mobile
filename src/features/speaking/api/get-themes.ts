import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { ThemeResponse, Content } from "./speaking.types";

export async function getThemesApi(): Promise<Content[]> {
  const response = await api.get<ApiResponse<ThemeResponse<Content>>>(
    "/learner/conversation/themes",
  );
  return response.data.data.content;
}
