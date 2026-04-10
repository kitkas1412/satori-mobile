import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Check } from "lucide-react-native";
import { Text, View } from "react-native";
import type { BadgeProgress } from "../api";

const BADGE_CONFIG: Record<
  BadgeProgress["badgeType"],
  { emoji: string; bg: string; border: string; dot: string }
> = {
  LEARNING_STREAK: { emoji: "🔥", bg: "#fef2f2", border: "#fecaca", dot: "#ef4444" },
  AI_SPEAKING_COUNT: { emoji: "🗣️", bg: "#f5f3ff", border: "#ddd6fe", dot: "#6b3eec" },
  AI_PRACTICE_COUNT: { emoji: "💪", bg: "#f0fdf4", border: "#bbf7d0", dot: "#16a34a" },
  LEARNING_LEVEL: { emoji: "🏆", bg: "#fffbeb", border: "#fde68a", dot: "#d97706" },
};

interface BadgeCardProps {
  badge: BadgeProgress;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const config = BADGE_CONFIG[badge.badgeType];

  return (
    <View
      style={{
        width: 114,
        borderRadius: 14,
        borderWidth: 1.23,
        borderColor: config.border,
        backgroundColor: config.bg,
        paddingVertical: 12,
        paddingHorizontal: 12,
        gap: 8,
      }}
    >
      {/* Emoji circle */}
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: config.bg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 24 }}>{config.emoji}</Text>
        </View>
      </View>

      {/* Title + description */}
      <View style={{ alignItems: "center", gap: 2 }}>
        <Text
          className="font-heading"
          style={{ fontSize: 11, color: theme.text.primary, textAlign: "center" }}
          numberOfLines={2}
        >
          {badge.badgeName}
        </Text>
        <Text
          style={{ fontSize: 9, color: "#9ca3af", textAlign: "center" }}
          numberOfLines={2}
        >
          {badge.requirementValue} {badge.badgeType === "LEARNING_STREAK" ? "ngày" : badge.badgeType === "AI_SPEAKING_COUNT" ? "hội thoại" : badge.badgeType === "AI_PRACTICE_COUNT" ? "lần" : "level"}
        </Text>
      </View>

      {/* Earned dot indicator */}
      {badge.earned && (
        <View
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: config.dot,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check size={9} color="#fff" strokeWidth={3} />
        </View>
      )}
    </View>
  );
}
