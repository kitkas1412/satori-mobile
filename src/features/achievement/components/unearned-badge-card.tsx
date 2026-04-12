import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Lock } from "lucide-react-native";
import { Image, Text, View } from "react-native";
import type { Badge } from "../api";

export function UnearnedBadgeCard({ badge }: { badge: Badge }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
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
        <Lock size={14} color="#9ca3af" />
      </View>

      {/* Icon */}
      <Image
        source={{ uri: badge.iconUrl }}
        style={{ width: 48, height: 48 }}
        resizeMode="contain"
      />

      {/* Name + description */}
      <View style={{ alignItems: "center", gap: 2, width: "100%" }}>
        <Text
          className="font-heading"
          style={{ fontSize: 11, color: "#6b7280", textAlign: "center" }}
          numberOfLines={2}
        >
          {badge.name}
        </Text>
        <Text
          style={{ fontSize: 9, color: "#9ca3af", textAlign: "center" }}
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
            backgroundColor: "#e5e7eb",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: 4,
              borderRadius: 100,
              backgroundColor: "#3d5cc4",
              width: `${badge.progressPercent}%`,
            }}
          />
        </View>
        <Text style={{ fontSize: 9, color: "#9ca3af", textAlign: "center" }}>
          {badge.currentValue}/{badge.requirementValue}
        </Text>
      </View>
    </View>
  );
}
