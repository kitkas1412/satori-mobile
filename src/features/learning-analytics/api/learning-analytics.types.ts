import type { ApiResponse } from "@/types/api";

export type SkillTrend = "STABLE" | "UP" | "DOWN";
export type TrendDirection = "UP" | "DOWN" | "STABLE";

export interface WeeklyDataPoint {
  label: string;
  startDate: string;
  endDate: string;
  sessionsCompleted: number;
  totalStudyMinutes: number;
  averageScore: number;
  expEarned: number;
}

export interface WeeklyTrends {
  scoreDirection: TrendDirection;
  studyTimeDirection: TrendDirection;
  consistencyRate: number;
}

export interface WeeklyProgressData {
  period: string;
  dataPoints: WeeklyDataPoint[];
  trends: WeeklyTrends;
}

export type WeeklyProgressResponse = ApiResponse<WeeklyProgressData>;

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
