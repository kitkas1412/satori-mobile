import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppStore } from "@/stores/app-store";
import { Circle, Monitor, Moon, Sun } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  Icon: typeof Sun;
};

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Sáng", Icon: Sun },
  { value: "dark", label: "Tối", Icon: Moon },
  { value: "system", label: "Hệ thống", Icon: Monitor },
];

export function ThemeSelector() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const selectedTheme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  return (
    <View
      className="mx-4 mb-4 px-6 py-4 rounded-2xl"
      style={{ backgroundColor: theme.cardBackground }}
    >
      <Text
        className="text-sm font-heading mb-3"
        style={{ color: theme.textMuted }}
      >
        Giao diện
      </Text>

      {THEME_OPTIONS.map(({ value, label, Icon }) => {
        const isSelected = selectedTheme === value;

        return (
          <TouchableOpacity
            key={value}
            onPress={() => setTheme(value)}
            className="flex-row items-center gap-3 py-2"
            activeOpacity={0.6}
          >
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

            <Icon size={18} color={isSelected ? theme.primary : theme.textMuted} />

            <Text
              className="text-base font-body"
              style={{ color: isSelected ? theme.textDefault : theme.textMuted }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
