import { Text, TouchableOpacity, View } from "react-native";

import type { Colors } from "@/constants/theme";
import type { AnswerResponse, Items } from "../api/practice-with-ai.types";
import { FeedbackPanel } from "./feedback-panel";

type Theme = typeof Colors.light;

interface FillBlankSectionProps {
  currentItem: Items;
  selectedOptionId: number | null;
  answerResult: AnswerResponse | null;
  isSubmitting: boolean;
  theme: Theme;
  onSelectOption: (id: number) => void;
}

export function FillBlankSection({
  currentItem,
  selectedOptionId,
  answerResult,
  isSubmitting,
  theme,
  onSelectOption,
}: FillBlankSectionProps) {
  const parts = currentItem.question.split("___");
  const before = parts[0] ?? "";
  const after = parts[1] ?? "";

  const selectedOption = currentItem.options.find(
    (o) => o.id === selectedOptionId,
  );

  // Xác định trạng thái blank slot sau khi submit
  const isCorrect = answerResult?.correct ?? null;
  const blankBorderColor =
    isCorrect === null
      ? selectedOption
        ? theme.brand.primary
        : theme.border.strong
      : isCorrect
        ? theme.success.default
        : theme.error.default;
  const blankBg =
    isCorrect === null
      ? "transparent"
      : isCorrect
        ? theme.success.subtle
        : theme.error.subtle;
  const blankTextColor =
    isCorrect === null
      ? selectedOption
        ? theme.brand.primary
        : theme.text.disabled
      : isCorrect
        ? theme.success.default
        : theme.error.default;

  return (
    <View style={{ gap: 12 }}>
      {/* Sentence card with inline blank slot */}
      <View
        style={{
          backgroundColor: theme.background.surface,
          borderWidth: 1,
          borderColor: theme.border.subtle,
          borderRadius: 16,
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          {before.length > 0 && (
            <Text
              className="font-heading"
              style={{
                fontSize: 17,
                lineHeight: 28,
                color: theme.text.primary,
              }}
            >
              {before}
            </Text>
          )}

          {/* Blank slot */}
          <View
            style={{
              minWidth: 64,
              paddingHorizontal: 12,
              paddingTop: 2,
              paddingBottom: 3,
              borderBottomWidth: 2,
              borderBottomColor: blankBorderColor,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              backgroundColor: blankBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              className="font-heading"
              style={{
                fontSize: 17,
                lineHeight: 26,
                color: blankTextColor,
                minHeight: 26,
              }}
            >
              {selectedOption?.text ?? ""}
            </Text>
          </View>

          {after.length > 0 && (
            <Text
              className="font-heading"
              style={{
                fontSize: 17,
                lineHeight: 28,
                color: theme.text.primary,
              }}
            >
              {after}
            </Text>
          )}
        </View>
      </View>

      {/* Word chips */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {currentItem.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrectAnswer =
            answerResult !== null && option.text === answerResult.correctAnswer;
          const isWrongSelected =
            answerResult !== null && isSelected && !answerResult.correct;

          let chipBg = theme.background.surface;
          let chipBorder = theme.border.subtle;
          let chipTextColor = theme.text.primary;

          if (answerResult !== null) {
            if (isCorrectAnswer) {
              chipBg = theme.success.subtle;
              chipBorder = theme.success.default;
              chipTextColor = theme.success.default;
            } else if (isWrongSelected) {
              chipBg = theme.error.subtle;
              chipBorder = theme.error.default;
              chipTextColor = theme.error.default;
            }
          } else if (isSelected) {
            chipBg = theme.brand.primary;
            chipBorder = theme.brand.primary;
            chipTextColor = theme.text.onBrand;
          }

          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => onSelectOption(option.id)}
              disabled={isSubmitting || answerResult !== null}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: chipBorder,
                backgroundColor: chipBg,
              }}
            >
              <Text
                className="font-heading"
                style={{ fontSize: 16, lineHeight: 24, color: chipTextColor }}
              >
                {option.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback panel */}
      {answerResult !== null && (
        <FeedbackPanel answerResult={answerResult} theme={theme} />
      )}
    </View>
  );
}
