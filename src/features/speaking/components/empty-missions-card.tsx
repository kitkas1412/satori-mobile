import { Text, View } from "react-native";
import { ClipboardList } from "lucide-react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export function EmptyMissionsCard() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
      className="rounded-xl p-8 items-center gap-3 border"
      style={{
        backgroundColor: theme.background.surface,
        borderColor: theme.border.subtle,
      }}
    >
      <View
        className="rounded-full items-center justify-center"
        style={{ width: 48, height: 48, backgroundColor: theme.border.subtle }}
      >
        <ClipboardList size={24} color={theme.icon.secondary} />
      </View>
      <Text className="font-body text-xs" style={{ color: theme.text.primary }}>
        Chưa có nhiệm vụ nào được ghi nhận.
      </Text>
    </View>
  );
}
