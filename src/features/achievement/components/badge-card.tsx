import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Check } from "lucide-react-native";
import { Image, Text, View } from "react-native";
import type { BadgeProgress } from "../api";

const DOT_COLOR: Record<BadgeProgress["badgeType"], string> = {
  LEARNING_STREAK: "#ef4444",
  AI_SPEAKING_COUNT: "#6b3eec",
  AI_PRACTICE_COUNT: "#16a34a",
  LEARNING_LEVEL: "#d97706",
};

const LABEL: Record<BadgeProgress["badgeType"], string> = {
  LEARNING_STREAK: "ngày",
  AI_SPEAKING_COUNT: "hội thoại",
  AI_PRACTICE_COUNT: "lần",
  LEARNING_LEVEL: "level",
};

interface BadgeCardProps {
  badge: BadgeProgress;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
      style={{
        width: 114,
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 12,
        gap: 8,
      }}
    >
      {/* Icon */}
      <View style={{ alignItems: "center" }}>
        <Image
          source={{ uri: badge.iconUrl }}
          style={{ width: 48, height: 48 }}
          resizeMode="contain"
        />
      </View>

      {/* Title + description */}
      <View style={{ alignItems: "center", gap: 2 }}>
        <Text
          className="font-heading"
          style={{
            fontSize: 11,
            color: theme.text.primary,
            textAlign: "center",
          }}
          numberOfLines={2}
        >
          {badge.badgeName}
        </Text>
        <Text
          style={{ fontSize: 9, color: "#9ca3af", textAlign: "center" }}
          numberOfLines={2}
        >
          {badge.requirementValue} {LABEL[badge.badgeType]}
        </Text>
      </View>

      {/* Earned dot indicator */}
      {/*{badge.earned && (
        <View
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: DOT_COLOR[badge.badgeType],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check size={9} color="#fff" strokeWidth={3} />
        </View>
      )}*/}
    </View>
  );
}
