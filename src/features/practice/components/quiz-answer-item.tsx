import { Check, ChevronDown, ChevronUp, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { MarkdownText } from "@/components/ui";
import type { QuizDetail } from "../api";

interface QuizAnswerItemProps {
  item: QuizDetail;
  index: number;
  theme: (typeof Colors)["light"];
}

export function QuizAnswerItem({ item, index, theme }: QuizAnswerItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      onPress={() => setExpanded((v) => !v)}
      className="bg-background-surface rounded-2xl overflow-hidden"
      style={{
        borderWidth: 1.5,
        borderColor: item.correct ? theme.success : theme.error,
      }}
    >
      {/* Row: indicator + question text + chevron */}
      <View className="flex-row items-center gap-3 p-4">
        <View
          className="items-center justify-center rounded-full"
          style={{
            width: 28,
            height: 28,
            backgroundColor: item.correct ? theme.success : theme.error,
            flexShrink: 0,
          }}
        >
          {item.correct ? (
            <Check size={14} color={theme.white} strokeWidth={2.5} />
          ) : (
            <X size={14} color={theme.white} strokeWidth={2.5} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <MarkdownText fontSize={14} color={theme.textDefault}>
            {`${index + 1}. ${item.questionText}`}
          </MarkdownText>
        </View>
        {expanded ? (
          <ChevronUp size={16} color={theme.textMuted} strokeWidth={2} />
        ) : (
          <ChevronDown size={16} color={theme.textMuted} strokeWidth={2} />
        )}
      </View>

      {/* Expanded detail */}
      {expanded && (
        <View
          className="px-4 pb-4 gap-2"
          style={{
            borderTopWidth: 1,
            borderTopColor: item.correct ? theme.success : theme.error,
          }}
        >
          {!item.correct && (
            <View className="gap-2 pt-3">
              <View className="flex-row flex-wrap items-center gap-1">
                <Text className="font-body text-xs" style={{ color: theme.textMuted }}>
                  Bạn chọn:
                </Text>
                <MarkdownText fontSize={12} color={theme.error}>
                  {item.selectedAnswer}
                </MarkdownText>
              </View>
              <View className="flex-row flex-wrap items-center gap-1">
                <Text className="font-body text-xs" style={{ color: theme.textMuted }}>
                  Đáp án đúng:
                </Text>
                <MarkdownText fontSize={12} color={theme.success}>
                  {item.correctAnswer}
                </MarkdownText>
              </View>
            </View>
          )}
          {item.correct && (
            <View className="pt-3">
              <View className="flex-row flex-wrap items-center gap-1">
                <Text className="font-body text-xs" style={{ color: theme.textMuted }}>
                  Đáp án đúng:
                </Text>
                <MarkdownText fontSize={12} color={theme.success}>
                  {item.correctAnswer}
                </MarkdownText>
              </View>
            </View>
          )}
          {!!item.explanation && (
            <View
              className="rounded-xl p-3"
              style={{ backgroundColor: theme.background }}
            >
              <MarkdownText fontSize={12} color={theme.textMuted}>
                {item.explanation}
              </MarkdownText>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}
