import { Bell } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface BellButtonProps {
  onPress?: () => void;
  hasUnread?: boolean;
}

export function BellButton({ onPress, hasUnread }: BellButtonProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Pressable onPress={onPress}>
      <View className="relative">
        <View
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: theme.icon.disabled }}
        >
          <Bell size={20} color={theme.icon.onBrand} strokeWidth={2} />
        </View>
        {hasUnread && (
          <View className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-error-default" />
        )}
      </View>
    </Pressable>
  );
}
