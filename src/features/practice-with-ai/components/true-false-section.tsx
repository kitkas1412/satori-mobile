import { Check, X } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { AnswerResponse, Items } from "../api/practice-with-ai.types";
import { FeedbackPanel } from "./feedback-panel";

type Theme = typeof Colors.light;

export interface TrueFalseSectionProps {
  currentItem: Items;
  selectedOptionId: number | null;
  answerResult: AnswerResponse | null;
  isSubmitting: boolean;
  theme: Theme;
  onSelectOption: (id: number) => void;
}

// First option = Đúng (check icon), second = Sai (X icon)
const OPTION_ICONS = [Check, X] as const;

export function TrueFalseSection({
  currentItem,
  selectedOptionId,
  answerResult,
  isSubmitting,
  theme,
  onSelectOption,
}: TrueFalseSectionProps) {
  return (
    <View style={{ gap: 24 }}>
      {/* Statement card */}
      <View
        style={{
          backgroundColor: theme.background.surface,
          borderRadius: 16,
          borderWidth: 0.667,
          borderColor: theme.border.subtle,
          padding: 16,
        }}
      >
        <Text
          className="font-heading"
          style={{ fontSize: 14, lineHeight: 22, color: theme.text.primary }}
        >
          {currentItem.question}
        </Text>
      </View>

      {/* True / False buttons */}
      <View style={{ flexDirection: "row", gap: 16 }}>
        {currentItem.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrectAnswer =
            answerResult !== null && option.text === answerResult.correctAnswer;
          const isWrongSelected =
            answerResult !== null && isSelected && !answerResult.correct;

          let borderColor = theme.border.subtle;
          let bgColor = theme.background.surface;
          let iconColor = theme.text.secondary;
          let textColor = theme.text.secondary;

          if (answerResult === null && isSelected) {
            borderColor = theme.brand.primary;
            bgColor = theme.brand.primarySubtle;
            iconColor = theme.brand.primary;
            textColor = theme.brand.primary;
          } else if (answerResult !== null) {
            if (isCorrectAnswer) {
              borderColor = theme.success.default;
              bgColor = theme.success.subtle;
              iconColor = theme.success.default;
              textColor = theme.success.default;
            } else if (isWrongSelected) {
              borderColor = theme.error.default;
              bgColor = theme.error.subtle;
              iconColor = theme.error.default;
              textColor = theme.error.default;
            }
          }

          const Icon = OPTION_ICONS[index] ?? Check;

          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => onSelectOption(option.id)}
              disabled={isSubmitting || answerResult !== null}
              style={{
                flex: 1,
                height: 76,
                borderRadius: 14,
                borderWidth: 1,
                borderColor,
                backgroundColor: bgColor,
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <Icon size={24} color={iconColor} />
              <Text
                className="font-body"
                style={{ fontSize: 14, color: textColor }}
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
