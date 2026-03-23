import { IconButton, PrimaryButton, ScreenHeader } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StatusBar } from "expo-status-bar";
import { useAppStore } from "@/stores/app-store";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ThemeValue = "light" | "dark" | "system";

const THEME_OPTIONS: { value: ThemeValue; label: string }[] = [
  { value: "light", label: "Sáng" },
  { value: "dark", label: "Tối" },
  { value: "system", label: "Hệ thống" },
];

export function ThemeSelectorScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const currentTheme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedTheme, setSelectedTheme] = useState<ThemeValue>(currentTheme);

  const handleConfirm = () => {
    setTheme(selectedTheme);
    router.back();
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <ScreenHeader
        title="Giao diện"
        paddingTop={insets.top + 16}
        leftAction={
          <IconButton
            icon={<ChevronLeft size={24} color={theme.iconDefault} />}
            onPress={() => router.back()}
          />
        }
      />

      <View className="flex-1 px-4 pt-4">
        {THEME_OPTIONS.map(({ value, label }) => {
          const isSelected = selectedTheme === value;

          return (
            <TouchableOpacity
              key={value}
              onPress={() => setSelectedTheme(value)}
              activeOpacity={0.7}
              className="flex-row justify-between items-center px-4 py-4 rounded-2xl mb-3 border"
              style={{
                backgroundColor: theme.cardBackground,
                borderColor: isSelected ? theme.primary : theme.border,
              }}
            >
              <Text
                className="text-base font-body"
                style={{ color: theme.textDefault }}
              >
                {label}
              </Text>

              <View
                className="w-5 h-5 rounded-full border-2 items-center justify-center"
                style={{
                  borderColor: isSelected ? theme.primary : theme.border,
                }}
              >
                {isSelected && (
                  <View
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View
        style={{
          paddingTop: 16,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 8,
        }}
      >
        <PrimaryButton text="Xác nhận" onPress={handleConfirm} />
      </View>
    </View>
  );
}
