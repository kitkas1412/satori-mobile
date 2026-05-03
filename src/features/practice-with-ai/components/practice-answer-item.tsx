// Component hiển thị kết quả một câu hỏi trong màn hình kết quả luyện tập AI.
// Có thể mở rộng (expand) để xem đáp án đúng, đáp án đã chọn và giải thích.

import { Check, ChevronDown, ChevronUp, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { MarkdownText } from "@/components/ui";
import type {
  ItemType,
  Options,
  PracticeSessionSummaryItem,
} from "../api/practice-with-ai.types";

interface PracticeAnswerItemProps {
  item: PracticeSessionSummaryItem;
  index: number;
  theme: (typeof Colors)["light"];
  options?: Options[];
  itemType?: ItemType;
}

function resolveAnswerText(
  answer: string,
  options?: Options[],
  itemType?: ItemType,
): string {
  if (!options || options.length === 0) return answer;
  if (itemType === "SENTENCE_ORDER") {
    const resolved = answer
      .split(",")
      .map((id) => options.find((o) => String(o.id) === id.trim())?.text ?? id)
      .join(" ");
    return resolved || answer;
  }
  return options.find((o) => String(o.id) === answer)?.text ?? answer;
}

export function PracticeAnswerItem({
  item,
  index,
  theme,
  options,
  itemType,
}: PracticeAnswerItemProps) {
  const [expanded, setExpanded] = useState(false);
  const userAnswerText = resolveAnswerText(item.userAnswer, options, itemType);
  const correctAnswerText = resolveAnswerText(
    item.correctAnswer,
    options,
    itemType,
  );

  return (
    <Pressable
      onPress={() => setExpanded((v) => !v)}
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.background.surface,
        borderWidth: 1.5,
        // Viền xanh lá nếu đúng, đỏ nếu sai
        borderColor: item.isCorrect
          ? theme.success.default
          : theme.error.default,
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
            backgroundColor: item.isCorrect
              ? theme.success.default
              : theme.error.default,
            flexShrink: 0,
          }}
        >
          {item.isCorrect ? (
            <Check size={14} color={theme.icon.onBrand} strokeWidth={2.5} />
          ) : (
            <X size={14} color={theme.icon.onBrand} strokeWidth={2.5} />
          )}
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text
            className="font-body"
            style={{
              fontSize: 14,
              color: theme.text.primary,
              marginRight: 4,
              paddingTop: 3,
            }}
          >
            {index + 1}.
          </Text>
          <MarkdownText fontSize={14} color={theme.text.primary}>
            {item.question}
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
            borderTopColor: item.isCorrect
              ? theme.success.default
              : theme.error.default,
          }}
        >
          {/* Câu sai: hiển thị cả đáp án đã chọn (đỏ) và đáp án đúng (xanh) */}
          {!item.isCorrect && (
            <View className="gap-2 pt-3">
              <View className="flex-row flex-wrap items-center gap-1">
                <Text
                  className="font-body text-xs"
                  style={{ color: theme.text.secondary }}
                >
                  Bạn trả lời:
                </Text>
                <MarkdownText fontSize={12} color={theme.error.default}>
                  {userAnswerText || "-"}
                </MarkdownText>
              </View>
              <View className="flex-row flex-wrap items-center gap-1">
                <Text
                  className="font-body text-xs"
                  style={{ color: theme.text.secondary }}
                >
                  Đáp án đúng:
                </Text>
                <MarkdownText fontSize={12} color={theme.success.text}>
                  {correctAnswerText || "-"}
                </MarkdownText>
              </View>
            </View>
          )}
          {/* Câu đúng: chỉ hiển thị đáp án đúng để xác nhận */}
          {item.isCorrect && (
            <View className="pt-3">
              <View className="flex-row flex-wrap items-center gap-1">
                <Text
                  className="font-body text-xs"
                  style={{ color: theme.text.secondary }}
                >
                  Đáp án đúng:
                </Text>
                <MarkdownText fontSize={12} color={theme.success.text}>
                  {correctAnswerText || "-"}
                </MarkdownText>
              </View>
            </View>
          )}
          {/* Giải thích — chỉ hiển thị nếu có */}
          {!!item.explanation && (
            <View
              className="rounded-xl p-3 mt-1"
              style={{ backgroundColor: theme.background.page }}
            >
              <MarkdownText fontSize={12} color={theme.text.secondary}>
                {item.explanation}
              </MarkdownText>
            </View>
          )}
          {/* AI feedback — chỉ hiển thị nếu có */}
          {!!item.aiFeedback && (
            <View
              className="rounded-xl p-3"
              style={{ backgroundColor: theme.background.page }}
            >
              <Text
                className="font-body-bold text-xs mb-1"
                style={{ color: theme.text.secondary }}
              >
                AI nhận xét:
              </Text>
              <MarkdownText fontSize={12} color={theme.text.secondary}>
                {item.aiFeedback}
              </MarkdownText>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}
