import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import type { Badge } from "../api";

export function EarnedBadgeCard({ badge, onPress }: { badge: Badge; onPress?: () => void }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        width: 114,
        borderRadius: 14,
        paddingVertical: 8,
        paddingHorizontal: 8,
        gap: 8,
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.border.subtle,
      }}
    >
      <Image
        source={{ uri: badge.iconUrl }}
        style={{ width: 48, height: 48 }}
        contentFit="contain"
      />

      <View style={{ alignItems: "center", gap: 2, width: "100%" }}>
        <Text
          className="font-heading"
          style={{
            fontSize: 11,
            color: theme.text.primary,
            textAlign: "center",
          }}
          numberOfLines={2}
        >
          {badge.name}
        </Text>
        <Text
          style={{
            fontSize: 9,
            color: theme.text.secondary,
            textAlign: "center",
          }}
          numberOfLines={2}
        >
          {badge.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
