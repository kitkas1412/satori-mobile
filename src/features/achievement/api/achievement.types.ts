export interface BadgeProgress {
  badgeId: string;
  badgeName: string;
  badgeType: "LEARNING_STREAK" | "AI_SPEAKING_COUNT" | "AI_PRACTICE_COUNT" | "LEARNING_LEVEL";
  requirementValue: number;
  currentValue: number;
  earned: boolean;
  iconUrl: string;
  progress: number;
}

export interface AchievementProgress {
  userId: string;
  streakCurrent: number;
  streakLongest: number;
  practiceCount: number;
  speakingCount: number;
  currentLevel: number;
  totalExp: number;
  badgeProgress: BadgeProgress[];
}

export interface Badge {
  badgeId: string;
  name: string;
  description: string;
  badgeType: "LEARNING_STREAK" | "AI_SPEAKING_COUNT" | "AI_PRACTICE_COUNT" | "LEARNING_LEVEL";
  requirementValue: number;
  expReward: number;
  iconUrl: string;
  earned: boolean;
  earnedAt: string | null;
  currentValue: number;
  progressPercent: number;
  isFeatured: boolean;
}

export interface BadgesPage {
  content: Badge[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
