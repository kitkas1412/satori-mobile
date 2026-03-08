import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { LessonSectionItem, PagedContent } from "./speaking.types";

export async function getThemesApi(): Promise<LessonSectionItem[]> {
  const response = await api.get<ApiResponse<PagedContent<LessonSectionItem>>>(
    "/learner/conversation/themes"
  );
  return response.data.data.content;
}
