// Card hiển thị đánh giá ngôn ngữ chi tiết trên màn hình ConversationFeedbackScreen.
// Bao gồm 4 chỉ số điểm (lưu loát, chính xác, từ vựng, ngữ pháp),
// tóm tắt tổng thể, điểm mạnh và điểm cần cải thiện từ AI.

import { Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import type { LanguageEvaluation } from "@/features/speaking/api";

interface LanguageEvaluationCardProps {
  languageEvaluation: LanguageEvaluation;
}

export function LanguageEvaluationCard({
  languageEvaluation,
}: LanguageEvaluationCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
      className="rounded-2xl p-4 gap-3 border"
      style={{
        backgroundColor: theme.background.surface,
        borderColor: theme.border.subtle,
      }}
    >
      <Text
        className="font-heading text-base"
        style={{ color: theme.text.primary }}
      >
        Đánh giá ngôn ngữ
      </Text>

      {/* 4 chỉ số điểm con: lưu loát, chính xác, từ vựng, ngữ pháp */}
      <View className="flex-row flex-wrap gap-3">
        {[
          { label: "Lưu loát", val: languageEvaluation.fluencyScore },
          { label: "Chính xác", val: languageEvaluation.accuracyScore },
          { label: "Từ vựng", val: languageEvaluation.vocabularyScore },
          { label: "Ngữ pháp", val: languageEvaluation.grammarScore },
        ].map(({ label, val }) => (
          <View
            key={label}
            className="rounded-lg px-3 py-2 items-center"
            style={{ backgroundColor: theme.border.subtle }}
          >
            <Text
              className="font-heading text-sm"
              style={{ color: theme.brand.primary }}
            >
              {val != null ? Math.round(val) : "--"}
            </Text>
            <Text
              className="font-body text-xs"
              style={{ color: theme.text.secondary }}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Summary */}
      {languageEvaluation.summary ? (
        <Text
          className="font-body text-sm"
          style={{ color: theme.text.secondary }}
        >
          {languageEvaluation.summary}
        </Text>
      ) : null}

      {/* Strengths */}
      {languageEvaluation.strengths?.length > 0 && (
        <View className="gap-1">
          <Text
            className="font-heading text-sm"
            style={{ color: theme.success.default }}
          >
            Điểm mạnh
          </Text>
          {languageEvaluation.strengths.map((s, i) => (
            <Text
              key={i}
              className="font-body text-sm"
              style={{ color: theme.text.secondary }}
            >
              • {s}
            </Text>
          ))}
        </View>
      )}

      {/* Improvements */}
      {languageEvaluation.improvements?.length > 0 && (
        <View className="gap-1">
          <Text
            className="font-heading text-sm"
            style={{ color: theme.warning.default }}
          >
            Cần cải thiện
          </Text>
          {languageEvaluation.improvements.map((s, i) => (
            <Text
              key={i}
              className="font-body text-sm"
              style={{ color: theme.text.secondary }}
            >
              • {s}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
