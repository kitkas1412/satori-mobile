import { Text, View } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface ChatbotMessageBubbleProps {
  text: string;
  timestamp: string;
  role: "ai" | "user";
}

export function ChatbotMessageBubble({
  text,
  timestamp,
  role,
}: ChatbotMessageBubbleProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const isUser = role === "user";

  return (
    <View
      className={`flex-row ${isUser ? "justify-end" : "justify-start"}`}
    >
      <View
        className="rounded-2xl px-3 py-3 max-w-[80%]"
        style={{
          backgroundColor: isUser
            ? theme.brand.primary
            : theme.background.surface,
        }}
      >
        <Text
          className="font-body text-sm leading-5"
          style={{
            color: isUser ? theme.text.onBrand : theme.text.primary,
          }}
        >
          {text}
        </Text>
        <Text
          className="font-body text-xs mt-1"
          style={{
            color: isUser
              ? theme.brand.primarySubtle
              : theme.text.tertiary,
          }}
        >
          {timestamp}
        </Text>
      </View>
    </View>
  );
}
