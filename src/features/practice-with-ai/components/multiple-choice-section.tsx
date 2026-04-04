import { CheckCircle, XCircle } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { AnswerResponse, Items } from "../api/practice-with-ai.types";
import { FeedbackPanel } from "./feedback-panel";

type Theme = typeof Colors.light;


export interface MultipleChoiceSectionProps {
  currentItem: Items;
  selectedOptionId: number | null;
  answerResult: AnswerResponse | null;
  isSubmitting: boolean;
  theme: Theme;
  onSelectOption: (id: number) => void;
}

export function MultipleChoiceSection({
  currentItem,
  selectedOptionId,
  answerResult,
  isSubmitting,
  theme,
  onSelectOption,
}: MultipleChoiceSectionProps) {
  return (
    <View style={{ gap: 10 }}>
      {currentItem.options.map((option) => {
        const isSelected = selectedOptionId === option.id;
        const isCorrectAnswer =
          answerResult !== null && option.text === answerResult.correctAnswer;
        const isWrongSelected =
          answerResult !== null && isSelected && !answerResult.correct;

        // Tính màu theo trạng thái
        let borderColor = isSelected ? theme.brand.primary : theme.border.subtle;
        let bgColor = isSelected ? theme.brand.primary : theme.background.surface;
        let circleBg = isSelected ? theme.brand.primary : theme.background.surface;
        let circleBorder = isSelected ? theme.icon.onBrand : theme.border.default;
        let letterColor = isSelected ? theme.icon.onBrand : theme.icon.disabled;
        let textColor = isSelected ? theme.text.onBrand : theme.text.disabled;

        if (answerResult !== null) {
          if (isCorrectAnswer) {
            borderColor = theme.success.default;
            bgColor = theme.success.subtle;
            circleBg = theme.success.default;
            circleBorder = theme.success.default;
            letterColor = theme.icon.onBrand;
            textColor = theme.success.default;
          } else if (isWrongSelected) {
            borderColor = theme.error.default;
            bgColor = theme.error.subtle;
            circleBg = theme.error.default;
            circleBorder = theme.error.default;
            letterColor = theme.icon.onBrand;
            textColor = theme.error.default;
          } else {
            borderColor = theme.border.subtle;
            bgColor = theme.background.surface;
            circleBg = theme.background.surface;
            circleBorder = theme.border.default;
            letterColor = theme.icon.disabled;
            textColor = theme.text.disabled;
          }
        }

        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => onSelectOption(option.id)}
            disabled={isSubmitting || answerResult !== null}
            style={{
              height: 62,
              borderRadius: 16,
              borderWidth: 1.23,
              borderColor,
              backgroundColor: bgColor,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 17,
              gap: 14,
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                borderWidth: 1,
                borderColor: circleBorder,
                backgroundColor: circleBg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                className="font-heading"
                style={{ fontSize: 13, color: letterColor }}
              >
                {option.id}
              </Text>
            </View>

            <Text
              className="font-heading flex-1"
              style={{
                fontSize: 15,
                lineHeight: 22,
                color: textColor,
              }}
            >
              {option.text}
            </Text>

            {isCorrectAnswer && (
              <CheckCircle size={16} color={theme.success.default} />
            )}
            {isWrongSelected && (
              <XCircle size={16} color={theme.error.default} />
            )}
          </TouchableOpacity>
        );
      })}

      {/* Feedback panel */}
      {answerResult !== null && (
        <View style={{ marginTop: 6 }}>
          <FeedbackPanel answerResult={answerResult} theme={theme} />
        </View>
      )}
    </View>
  );
}
