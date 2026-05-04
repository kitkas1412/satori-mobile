import { Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

interface FeedbackWarningBannerProps {
  variant: "warning" | "info";
  text: string;
}

export function FeedbackWarningBanner({ variant, text }: FeedbackWarningBannerProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const palette = variant === "warning" ? theme.warning : theme.info;

  return (
    <View
      className="rounded-xl px-4 py-3 border"
      style={{
        backgroundColor: palette.subtle,
        borderColor: palette.default,
      }}
    >
      <Text
        className="font-body text-xs leading-5"
        style={{ color: palette.text }}
      >
        {text}
      </Text>
    </View>
  );
}
