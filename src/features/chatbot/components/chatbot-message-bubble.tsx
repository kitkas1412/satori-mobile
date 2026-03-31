import { Text, View } from "react-native";
import { MarkdownText } from "@/components/ui";
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
    <View className={`flex-row ${isUser ? "justify-end" : "justify-start"}`}>
      <View
        className={`rounded-2xl px-3 py-3 ${isUser ? "max-w-[80%]" : "w-[80%]"}`}
        style={{
          backgroundColor: isUser
            ? theme.brand.primary
            : theme.background.surface,
          borderColor: isUser ? theme.brand.primary : theme.border.subtle,
          borderWidth: 1,
        }}
      >
        {isUser ? (
          <Text
            className="font-body text-sm leading-5"
            style={{ color: theme.text.onBrand }}
          >
            {text}
          </Text>
        ) : (
          <MarkdownText fontSize={14} lineHeight={20} color={theme.text.primary}>
            {text}
          </MarkdownText>
        )}
        <Text
          className="font-body text-xs mt-1"
          style={{
            color: isUser ? theme.brand.primarySubtle : theme.text.tertiary,
          }}
        >
          {timestamp}
        </Text>
      </View>
    </View>
  );
}
