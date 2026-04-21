import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Lock } from "lucide-react-native";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import type { Badge } from "../api";

export function UnearnedBadgeCard({ badge, onPress }: { badge: Badge; onPress?: () => void }) {
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
        opacity: 0.65,
      }}
    >
      {/* Lock icon */}
      <View
        style={{
          position: "absolute",
          top: 9,
          right: 9,
        }}
      >
        <Lock size={14} color={theme.icon.disabled} />
      </View>

      {/* Icon */}
      <Image
        source={{ uri: badge.iconUrl }}
        style={{ width: 48, height: 48 }}
        contentFit="contain"
      />

      {/* Name + description */}
      <View style={{ alignItems: "center", gap: 2, width: "100%" }}>
        <Text
          className="font-heading"
          style={{ fontSize: 11, color: theme.text.tertiary, textAlign: "center" }}
          numberOfLines={2}
        >
          {badge.name}
        </Text>
        <Text
          style={{ fontSize: 9, color: theme.text.tertiary, textAlign: "center" }}
          numberOfLines={2}
        >
          {badge.description}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={{ width: "100%", gap: 2 }}>
        <View
          style={{
            width: "100%",
            height: 4,
            borderRadius: 100,
            backgroundColor: theme.border.subtle,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: 4,
              borderRadius: 100,
              backgroundColor: theme.brand.primary,
              width: `${badge.progressPercent}%`,
            }}
          />
        </View>
        <Text style={{ fontSize: 9, color: theme.text.tertiary, textAlign: "center" }}>
          {badge.currentValue}/{badge.requirementValue}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
