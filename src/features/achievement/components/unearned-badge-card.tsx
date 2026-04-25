import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Lock } from "lucide-react-native";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

interface UnearnedBadgeCardProps {
  iconUrl: string;
  name: string;
  onPress?: () => void;
}

export function UnearnedBadgeCard({ iconUrl, name, onPress }: UnearnedBadgeCardProps) {
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
        source={{ uri: iconUrl }}
        style={{ width: 48, height: 48 }}
        contentFit="contain"
      />

      {/* Name */}
      <Text
        className="font-heading"
        style={{ fontSize: 11, color: theme.text.tertiary, textAlign: "center", width: "100%" }}
        numberOfLines={2}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}
