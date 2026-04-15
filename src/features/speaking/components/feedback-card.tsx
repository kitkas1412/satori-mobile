import { Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

interface FeedbackCardProps {
  title: string;
  text: string;
}

export function FeedbackCard({ title, text }: FeedbackCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
      className="rounded-xl p-4 gap-2 border"
      style={{
        backgroundColor: theme.background.surface,
        borderColor: theme.border.subtle,
      }}
    >
      <Text className="font-heading text-sm" style={{ color: theme.text.primary }}>
        {title}
      </Text>
      <Text
        className="font-body text-xs leading-5"
        style={{ color: theme.text.secondary }}
      >
        {text}
      </Text>
    </View>
  );
}
