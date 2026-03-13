import { Languages } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import type { FeedbackResultResponse, Messages } from "@/features/speaking/api";

export function MessageBubble({ message }: { message: Messages }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [showTranslation, setShowTranslation] = useState(false);

  if (message.role === "ASSISTANT") {
    return (
      <View className="self-start max-w-[85%]">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setShowTranslation((v) => !v)}
        >
          <View
            className="bg-white px-4 py-4 gap-2"
            style={{
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
              borderBottomRightRadius: 14,
            }}
          >
            <Text className="font-body text-base text-text-main">
              {message.content}
            </Text>
            {showTranslation && message.translation ? (
              <Text
                className="font-body text-sm"
                style={{ color: theme.textMuted }}
              >
                {message.translation}
              </Text>
            ) : null}
            <View className="self-end">
              <Languages size={12} color={theme.textMuted} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="self-end max-w-[85%]">
      <View
        className="bg-primary-default px-4 py-4"
        style={{
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          borderBottomLeftRadius: 14,
        }}
      >
        <Text className="font-body text-base text-text-main">
          {message.content}
        </Text>
      </View>
    </View>
  );
}

export function FeedbackBubble({
  feedback,
}: {
  feedback: FeedbackResultResponse;
}) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const summary = feedback.languageEvaluation?.summary;
  const score =
    feedback.overallScore != null ? Math.round(feedback.overallScore) : null;

  return (
    <View className="self-start max-w-[85%]">
      <View
        className="bg-white px-4 py-4 gap-2"
        style={{
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          borderBottomRightRadius: 14,
        }}
      >
        <Text className="font-heading text-base text-text-main">
          Tóm tắt đánh giá
        </Text>
        {score != null && (
          <Text className="font-body text-sm" style={{ color: theme.primary }}>
            Điểm tổng: {score}/100
          </Text>
        )}
        {summary ? (
          <Text className="font-body text-sm text-text-main">{summary}</Text>
        ) : (
          <Text
            className="font-body text-sm"
            style={{ color: theme.textMuted }}
          >
            Buổi học đã hoàn thành!
          </Text>
        )}
      </View>
    </View>
  );
}
