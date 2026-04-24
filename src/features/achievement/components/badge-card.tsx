import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import type { EarnedBadge } from "../api";

interface BadgeCardProps {
  badge: EarnedBadge;
  onPress?: () => void;
}

export function BadgeCard({ badge, onPress }: BadgeCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      style={{
        width: 114,
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 12,
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: badge.iconUrl }}
        style={{ width: 48, height: 48 }}
        contentFit="contain"
      />
    </TouchableOpacity>
  );
}
