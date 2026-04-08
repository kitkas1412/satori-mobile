import { Languages } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
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
            className="px-4 border py-4 gap-2"
            style={{
              backgroundColor: theme.background.surface,
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
              borderBottomRightRadius: 14,
              borderColor: theme.border.subtle,
            }}
          >
            <Text
              className="font-body text-base"
              style={{ color: theme.text.primary }}
            >
              {message.content}
            </Text>
            {showTranslation && message.translation ? (
              <Text
                className="font-body text-sm"
                style={{ color: theme.text.secondary }}
              >
                {message.translation}
              </Text>
            ) : null}
            <View className="self-end">
              <Languages size={12} color={theme.text.secondary} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="self-end max-w-[85%]">
      <View
        className="px-4 py-4"
        style={{
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          borderBottomLeftRadius: 14,
          backgroundColor: theme.brand.primary,
        }}
      >
        <Text
          className="font-body text-base"
          style={{ color: theme.text.inverse }}
        >
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
  const router = useRouter();
  const summary = feedback.languageEvaluation?.summary;
  const score =
    feedback.overallScore != null ? Math.round(feedback.overallScore) : null;

  return (
    <View className="self-start max-w-[85%]">
      <View
        className="border px-4 py-4 gap-2"
        style={{
          backgroundColor: theme.background.surface,
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          borderBottomRightRadius: 14,
          borderColor: theme.border.subtle,
        }}
      >
        <Text
          className="font-heading text-base"
          style={{ color: theme.text.primary }}
        >
          Tóm tắt đánh giá
        </Text>
        {score != null && (
          <Text
            className="font-body text-sm"
            style={{ color: theme.brand.primary }}
          >
            Điểm tổng: {score}/100
          </Text>
        )}
        {summary ? (
          <Text
            className="font-body text-sm"
            style={{ color: theme.text.primary }}
          >
            {summary}
          </Text>
        ) : (
          <Text
            className="font-body text-sm"
            style={{ color: theme.text.secondary }}
          >
            Buổi học đã hoàn thành!
          </Text>
        )}
        <TouchableOpacity
          onPress={() => router.push("/conversation-feedback")}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text
            className="font-body text-sm"
            style={{ color: theme.brand.primary, textDecorationLine: "underline" }}
          >
            Xem kết quả chi tiết
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
