import { api } from "@/lib/axios";
import type { MasteryData, MasteryResponse } from "./learning-analytics.types";

export async function getMasteryApi(courseId: string): Promise<MasteryData> {
  const response = await api.get<MasteryResponse>("/learner/stats/mastery", {
    params: { courseId },
  });
  return response.data.data;
}
