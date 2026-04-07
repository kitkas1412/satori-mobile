// Types cho tính năng Streak.

// GET /api/v1/learner/achievements/streaks/current
export interface CurrentStreakResponse {
  current_streak: number;
  longest_streak: number;
  streak_last_date: string | null;
  freeze_tokens_available: number;
  days_until_break: number;
}

// GET /api/v1/learner/achievements/streaks/history
export interface StreakPeriod {
  start_date: string;
  end_date: string;
  days_requested: number;
}

export interface StreakSummary {
  active_count: number;
  total_days: number;
  activity_percentage: number;
  current_streak: number;
}

export interface StreakDailyRecord {
  date: string;
  streak_count: number;
  had_activity: boolean;
  activity_type: string | null;
  exp_earned: number;
  freeze_used: boolean;
}

export interface StreakHistoryResponse {
  period: StreakPeriod;
  summary: StreakSummary;
  daily_records: StreakDailyRecord[];
}
