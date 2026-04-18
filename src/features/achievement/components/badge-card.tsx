import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import type { EarnedBadge } from "../api";

interface BadgeCardProps {
  badge: EarnedBadge;
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
          contentFit="contain"
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
          style={{ fontSize: 9, color: theme.text.tertiary, textAlign: "center" }}
          numberOfLines={2}
        >
          {badge.description}
        </Text>
      </View>

    </View>
  );
}
