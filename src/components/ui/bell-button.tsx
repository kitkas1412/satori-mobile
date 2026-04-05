import { Bell } from "lucide-react-native";
import { View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function BellButton() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View className="relative">
      <View
        className="w-9 h-9 rounded-full items-center justify-center"
        style={{ backgroundColor: theme.icon.disabled }}
      >
        <Bell size={20} color={theme.icon.onBrand} strokeWidth={2} />
      </View>
    </View>
  );
}
