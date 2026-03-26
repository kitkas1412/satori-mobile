import { ActivityIndicator, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export function TypingIndicator() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View className="self-start">
      <View
        className="px-4 py-3 flex-row items-center gap-2"
        style={{
          backgroundColor: theme.background.surface,
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          borderBottomRightRadius: 14,
        }}
      >
        <ActivityIndicator size="small" color={theme.brand.primary} />
        <Text className="font-body text-sm" style={{ color: theme.text.secondary }}>
          AI đang trả lời...
        </Text>
      </View>
    </View>
  );
}
