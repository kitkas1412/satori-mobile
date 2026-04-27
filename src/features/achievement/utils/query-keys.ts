export const achievementQueryKeys = {
  all: ["achievement"] as const,
  progress: () => ["achievement", "progress"] as const,
  badges: () => ["achievement", "badges"] as const,
  earnedBadges: () => ["achievement", "earned-badges"] as const,
  badgeDetail: (id: string) => ["achievement", "badge", id] as const,
};
