import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";

interface BadgeCardProps {
  iconUrl: string;
  onPress?: () => void;
}

export function BadgeCard({ iconUrl, onPress }: BadgeCardProps) {
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
        source={{ uri: iconUrl }}
        style={{ width: 48, height: 48 }}
        contentFit="contain"
      />
    </TouchableOpacity>
  );
}
