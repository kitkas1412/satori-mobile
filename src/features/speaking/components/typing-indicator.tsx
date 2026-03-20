import { ActivityIndicator, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export function TypingIndicator() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View className="self-start">
      <View
        className="bg-white px-4 py-3 flex-row items-center gap-2"
        style={{
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          borderBottomRightRadius: 14,
        }}
      >
        <ActivityIndicator size="small" color={theme.primary} />
        <Text className="font-body text-sm" style={{ color: theme.textMuted }}>
          AI đang trả lời...
        </Text>
      </View>
    </View>
  );
}
