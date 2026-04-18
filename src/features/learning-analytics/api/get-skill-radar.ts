import { api } from "@/lib/axios";
import type { SkillRadarData, SkillRadarResponse } from "./learning-analytics.types";

export async function getSkillRadarApi(): Promise<SkillRadarData> {
  const response = await api.get<SkillRadarResponse>("/learner/stats/skill-radar");
  return response.data.data;
}
