import type { ApiResponse } from "@/types/api";

export type SkillTrend = "STABLE" | "UP" | "DOWN";

export interface SkillRadarItem {
  skill: string;
  score: number;
  previousScore: number;
  trend: SkillTrend;
  color: string;
  dataPoints: number;
}

export interface SkillRadarData {
  skills: SkillRadarItem[];
  overallScore: number;
  targetJlptLevel: string;
  lastUpdated: string;
}

// Full HTTP response — what the server actually returns
export type SkillRadarResponse = ApiResponse<SkillRadarData>;
