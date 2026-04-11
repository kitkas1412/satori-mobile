import { useQuery } from "@tanstack/react-query";
import { getLessonItemsApi } from "../api";

export function useLessonItems(lessonId: string) {
  return useQuery({
    queryKey: ["lessonItems", lessonId],
    queryFn: () => getLessonItemsApi(lessonId),
    enabled: !!lessonId,
  });
}
