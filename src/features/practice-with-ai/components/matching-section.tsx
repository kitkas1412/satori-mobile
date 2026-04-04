import { Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { AnswerResponse, Items } from "../api/practice-with-ai.types";
import { FeedbackPanel } from "./feedback-panel";

type Theme = typeof Colors.light;

export interface MatchingSectionProps {
  currentItem: Items;
  matchedPairs: { leftId: number; rightId: number }[];
  selectedLeftId: number | null;
  answerResult: AnswerResponse | null;
  isSubmitting: boolean;
  theme: Theme;
  onSelectLeft: (id: number) => void;
  onSelectRight: (id: number) => void;
}

export function MatchingSection({
  currentItem,
  matchedPairs,
  selectedLeftId,
  answerResult,
  isSubmitting,
  theme,
  onSelectLeft,
  onSelectRight,
}: MatchingSectionProps) {
  const leftOptions = currentItem.options.filter((o) => o.side === "LEFT");
  const rightOptions = currentItem.options.filter((o) => o.side === "RIGHT");

  function getPairedRightId(leftId: number): number | null {
    return matchedPairs.find((p) => p.leftId === leftId)?.rightId ?? null;
  }

  function getPairedLeftId(rightId: number): number | null {
    return matchedPairs.find((p) => p.rightId === rightId)?.leftId ?? null;
  }

  function getLeftButtonStyle(id: number) {
    const isPaired = getPairedRightId(id) !== null;
    const isSelected = selectedLeftId === id;

    if (answerResult !== null) {
      if (isPaired) {
        return answerResult.correct
          ? { bg: theme.success.subtle, border: theme.success.default, text: theme.success.default }
          : { bg: theme.error.subtle, border: theme.error.default, text: theme.error.default };
      }
      return { bg: theme.background.surface, border: theme.border.subtle, text: theme.text.disabled };
    }

    if (isPaired || isSelected) {
      return { bg: theme.brand.primary, border: theme.brand.primary, text: theme.text.onBrand };
    }

    return { bg: theme.background.surface, border: theme.border.subtle, text: theme.text.primary };
  }

  function getRightButtonStyle(id: number) {
    const isPaired = getPairedLeftId(id) !== null;

    if (answerResult !== null) {
      if (isPaired) {
        return answerResult.correct
          ? { bg: theme.success.subtle, border: theme.success.default, text: theme.success.default }
          : { bg: theme.error.subtle, border: theme.error.default, text: theme.error.default };
      }
      return { bg: theme.background.surface, border: theme.border.subtle, text: theme.text.disabled };
    }

    if (isPaired) {
      return { bg: theme.brand.primary, border: theme.brand.primary, text: theme.text.onBrand };
    }

    return { bg: theme.background.surface, border: theme.border.subtle, text: theme.text.primary };
  }

  const isDisabled = isSubmitting || answerResult !== null;

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 16 }}>
        {/* Left column */}
        <View style={{ flex: 1, gap: 16 }}>
          {leftOptions.map((option) => {
            const style = getLeftButtonStyle(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => onSelectLeft(option.id)}
                disabled={isDisabled}
                style={{
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: style.border,
                  backgroundColor: style.bg,
                  paddingHorizontal: 14,
                  paddingVertical: 18,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  className="font-heading"
                  style={{ fontSize: 14, color: style.text, textAlign: "center" }}
                >
                  {option.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Right column */}
        <View style={{ flex: 1, gap: 16 }}>
          {rightOptions.map((option) => {
            const style = getRightButtonStyle(option.id);
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => onSelectRight(option.id)}
                disabled={isDisabled}
                style={{
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: style.border,
                  backgroundColor: style.bg,
                  paddingHorizontal: 14,
                  paddingVertical: 18,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  className="font-heading"
                  style={{ fontSize: 14, color: style.text, textAlign: "center" }}
                >
                  {option.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {answerResult !== null && (
        <FeedbackPanel answerResult={answerResult} theme={theme} />
      )}
    </View>
  );
}
