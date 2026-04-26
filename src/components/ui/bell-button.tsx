import { Bell } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface BellButtonProps {
  onPress?: () => void;
  badgeCount?: number;
  showPlus?: boolean;
}

export function BellButton({ onPress, badgeCount, showPlus }: BellButtonProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const hasBadge = badgeCount != null && badgeCount > 0;
  const badgeLabel = badgeCount != null && badgeCount > 99
    ? "99+"
    : showPlus
    ? `${badgeCount}+`
    : `${badgeCount}`;

  return (
    <Pressable onPress={onPress}>
      <View className="relative">
        <View
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: theme.icon.disabled }}
        >
          <Bell size={20} color={theme.icon.onBrand} strokeWidth={2} />
        </View>
        {hasBadge && (
          <View className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-error-default items-center justify-center px-1">
            <Text className="text-tiny-xs font-heading text-white leading-none">
              {badgeLabel}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
