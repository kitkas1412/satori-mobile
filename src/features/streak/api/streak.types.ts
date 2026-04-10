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
  streak_start_date: string;
  cycle_number: number;
}

export interface StreakSummary {
  current_streak: number;
}

export interface StreakDailyRecord {
  date: string;
  day_of_week: string;
  is_today: boolean;
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
