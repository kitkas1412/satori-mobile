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
  pronunciationUtterances: number | null;
  pronunciationOverall: number | null;
  pronunciationAccuracy: number | null;
  pronunciationFluency: number | null;
  speakingSessions: number | null;
  languageOverall: number | null;
  speakingTaskCompletion: number | null;
}

export interface WeeklyTrends {
  scoreDirection: TrendDirection;
  studyTimeDirection: TrendDirection;
  consistencyRate: number;
  pronunciationDirection: TrendDirection;
  languageDirection: TrendDirection;
  sessionsDelta: number;
  scoreDelta: number;
  studyMinutesDelta: number;
  speakingSessionsDelta: number;
  pronunciationDelta: number;
  languageDelta: number;
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

export interface InsightPoint {
  category: string | null;
  skill: string | null;
  description: string | null;
  confidence: number;
  source: string | null;
  jlptLevel: string | null;
  relatedEntityIds: string[] | null;
  lastUpdated: string | null;
}

export interface InsightsData {
  weakPoints: InsightPoint[];
  strongPoints: InsightPoint[];
  recommendations: string[];
  lastUpdated: string;
}

export type InsightsResponse = ApiResponse<InsightsData>;
