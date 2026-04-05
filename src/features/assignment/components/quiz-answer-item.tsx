// Component hiển thị kết quả một câu hỏi trong màn hình kết quả trắc nghiệm.
// Có thể mở rộng (expand) để xem đáp án đúng, đáp án đã chọn và giải thích.

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
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.background.surface,
        borderWidth: 1.5,
        // Viền xanh lá nếu đúng, đỏ nếu sai
        borderColor: item.correct ? theme.success.default : theme.error.default,
      }}
    >
      {/* Hàng tóm tắt: indicator đúng/sai + nội dung câu hỏi + chevron */}
      <View className="flex-row items-center gap-3 p-4">
        {/* Chấm tròn màu xanh (đúng) hoặc đỏ (sai) */}
        <View
          className="items-center justify-center rounded-full"
          style={{
            width: 28,
            height: 28,
            backgroundColor: item.correct
              ? theme.success.default
              : theme.error.default,
            flexShrink: 0,
          }}
        >
          {item.correct ? (
            <Check size={14} color={theme.icon.onBrand} strokeWidth={2.5} />
          ) : (
            <X size={14} color={theme.icon.onBrand} strokeWidth={2.5} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <MarkdownText fontSize={14} color={theme.text.primary}>
            {`${index + 1}. ${item.questionText}`}
          </MarkdownText>
        </View>
        {/* Chevron chỉ hướng mở/đóng */}
        {expanded ? (
          <ChevronUp size={16} color={theme.icon.primary} strokeWidth={2} />
        ) : (
          <ChevronDown size={16} color={theme.icon.primary} strokeWidth={2} />
        )}
      </View>

      {/* Phần chi tiết mở rộng: đáp án đã chọn, đáp án đúng, giải thích */}
      {expanded && (
        <View
          className="px-4 pb-4 gap-2"
          style={{
            backgroundColor: theme.background.surface,
            borderTopWidth: 1,
            borderTopColor: item.correct
              ? theme.success.default
              : theme.error.default,
          }}
        >
          {/* Câu sai: hiển thị cả đáp án đã chọn (đỏ) và đáp án đúng (xanh) */}
          {!item.correct && (
            <View className="gap-2 pt-3">
              <View className="flex-row flex-wrap items-end gap-1">
                <Text
                  className="font-body text-xs"
                  style={{ color: theme.text.secondary }}
                >
                  Bạn chọn:
                </Text>
                <MarkdownText fontSize={12} color={theme.error.default}>
                  {item.selectedAnswer}
                </MarkdownText>
              </View>
              <View className="flex-row flex-wrap items-end gap-1">
                <Text
                  className="font-body text-xs"
                  style={{ color: theme.text.secondary }}
                >
                  Đáp án đúng:
                </Text>
                <MarkdownText fontSize={12} color={theme.success.text}>
                  {item.correctAnswer}
                </MarkdownText>
              </View>
            </View>
          )}
          {/* Câu đúng: chỉ hiển thị đáp án đúng để xác nhận */}
          {item.correct && (
            <View className="pt-3">
              <View className="flex-row flex-wrap items-end gap-1">
                <Text
                  className="font-body text-xs"
                  style={{ color: theme.text.secondary }}
                >
                  Đáp án đúng:
                </Text>
                <MarkdownText fontSize={12} color={theme.success.text}>
                  {item.correctAnswer}
                </MarkdownText>
              </View>
            </View>
          )}
          {/* Giải thích — chỉ hiển thị nếu có */}
          {!!item.explanation && (
            <View
              className="rounded-xl p-3"
              style={{ backgroundColor: theme.background.surface }}
            >
              <MarkdownText fontSize={12} color={theme.text.secondary}>
                {item.explanation}
              </MarkdownText>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}
