import type { ApiResponse } from "@/types/api";

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

export interface MasteryTier {
  level: number;
  label: string;
  count: number;
}

export interface MasteryCategory {
  mastered: number;
  learning: number;
  notStarted: number;
  total: number;
  percent: number;
  tiers: MasteryTier[];
}

export interface MasteryScope {
  type: string;
  id: string;
}

export interface MasteryNeedsReview {
  entityId: string;
  entityType: string;
  masteryLevel: number;
  emaScore: number;
  lastPracticedAt: string;
}

export interface MasteryData {
  scope: MasteryScope;
  vocabulary: MasteryCategory;
  grammar: MasteryCategory;
  needsReview: MasteryNeedsReview[];
  lastUpdated: string;
}

export type MasteryResponse = ApiResponse<MasteryData>;
