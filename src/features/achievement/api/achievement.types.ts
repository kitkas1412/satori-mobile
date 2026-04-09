export interface BadgeProgress {
  badgeId: string;
  badgeName: string;
  badgeType: "LEARNING_STREAK" | "AI_SPEAKING_COUNT" | "AI_PRACTICE_COUNT" | "LEARNING_LEVEL";
  requirementValue: number;
  currentValue: number;
  earned: boolean;
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
