import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppStore } from "@/stores/app-store";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const THEME_LABELS: Record<"light" | "dark" | "system", string> = {
  light: "Sáng",
  dark: "Tối",
  system: "Hệ thống",
};

export function ThemeSelector() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const selectedTheme = useAppStore((state) => state.theme);
  const router = useRouter();

  return (
    <View
      className="px-6 py-4 rounded-2xl flex-row justify-between items-center"
      style={{
        backgroundColor: theme.background.surface,
        borderColor: theme.border.subtle,
        borderWidth: 1,
      }}
    >
      <View>
        <Text
          className="text-sm font-heading mb-1"
          style={{ color: theme.text.secondary }}
        >
          Giao diện
        </Text>
        <Text
          className="text-base font-body"
          style={{ color: theme.text.primary }}
        >
          {THEME_LABELS[selectedTheme]}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/theme-selector")}
        activeOpacity={0.6}
        hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
      >
        <Text
          className="text-base font-heading"
          style={{ color: theme.brand.primary }}
        >
          Thay đổi
        </Text>
      </TouchableOpacity>
    </View>
  );
}
