import { Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { AnswerResponse, Items } from "../api/practice-with-ai.types";

type Theme = typeof Colors.light;

export interface SentenceOrderSectionProps {
  currentItem: Items;
  selectedWordIds: number[];
  answerResult: AnswerResponse | null;
  isSubmitting: boolean;
  theme: Theme;
  onToggleWord: (id: number) => void;
}

export function SentenceOrderSection({
  currentItem,
  selectedWordIds,
  answerResult,
  isSubmitting,
  theme,
  onToggleWord,
}: SentenceOrderSectionProps) {
  const correctTokens = answerResult?.correctAnswer.split(" ") ?? [];

  // Colour helpers for placed words after submit
  function getPlacedWordColor(wordText: string) {
    if (answerResult === null) return theme.text.primary;
    return answerResult.correct ? theme.success.default : theme.error.default;
  }

  function getAnswerLineColor() {
    if (answerResult === null) return theme.border.strong;
    return answerResult.correct ? theme.success.default : theme.error.default;
  }

  // Chip colour helpers for the pool after submit
  function getChipStyle(option: Items["options"][number]) {
    if (answerResult === null) {
      return {
        bg: theme.background.surface,
        border: theme.border.subtle,
        text: theme.text.primary,
      };
    }
    const isCorrectToken = correctTokens.includes(option.text);
    if (isCorrectToken) {
      return {
        bg: theme.success.subtle,
        border: theme.success.default,
        text: theme.success.default,
      };
    }
    return {
      bg: theme.background.surface,
      border: theme.border.subtle,
      text: theme.text.disabled,
    };
  }

  const placedWords = selectedWordIds
    .map((id) => currentItem.options.find((o) => o.id === id))
    .filter(Boolean) as Items["options"];

  const poolWords = currentItem.options.filter(
    (o) => !selectedWordIds.includes(o.id),
  );

  return (
    <View style={{ gap: 50 }}>
      {/* Translation card */}
      <View
        style={{
          borderRadius: 16,
          borderWidth: 0.667,
          borderColor: theme.border.subtle,
          backgroundColor: theme.background.surface,
          paddingVertical: 17,
          paddingHorizontal: 16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          className="font-heading"
          style={{
            fontSize: 14,
            color: theme.text.primary,
            textAlign: "center",
          }}
        >
          {currentItem.question}
        </Text>
      </View>

      {/* Answer area */}
      <View style={{ gap: 4 }}>
        {/* Placed words row */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            minHeight: 36,
          }}
        >
          {placedWords.map((word) => (
            <TouchableOpacity
              key={word.id}
              onPress={() => onToggleWord(word.id)}
              disabled={isSubmitting || answerResult !== null}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 14,
                borderWidth: 1,
                borderColor:
                  answerResult === null
                    ? theme.border.subtle
                    : getAnswerLineColor(),
                backgroundColor:
                  answerResult === null
                    ? theme.background.surface
                    : answerResult.correct
                      ? theme.success.subtle
                      : theme.error.subtle,
              }}
            >
              <Text
                className="font-heading"
                style={{
                  fontSize: 15,
                  lineHeight: 22.5,
                  color: getPlacedWordColor(word.text),
                }}
              >
                {word.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Two decorative answer lines */}
        <View style={{ gap: 40 }}>
          <View
            style={{
              borderBottomWidth: 2,
              borderBottomColor: theme.border.strong,
            }}
          />
          <View
            style={{
              borderBottomWidth: 2,
              borderBottomColor: theme.border.strong,
            }}
          />
        </View>
      </View>

      {/* Word chip pool */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
        }}
      >
        {poolWords.map((option) => {
          const style = getChipStyle(option);
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => onToggleWord(option.id)}
              disabled={isSubmitting || answerResult !== null}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: style.border,
                backgroundColor: style.bg,
              }}
            >
              <Text
                className="font-heading"
                style={{ fontSize: 15, lineHeight: 22.5, color: style.text }}
              >
                {option.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

    </View>
  );
}
