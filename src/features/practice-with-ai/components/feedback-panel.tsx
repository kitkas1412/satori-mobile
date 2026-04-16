import { CheckCircle, XCircle } from "lucide-react-native";
import { Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { AnswerResponse, Options } from "../api/practice-with-ai.types";

type Theme = typeof Colors.light;

export interface FeedbackPanelProps {
  answerResult: AnswerResponse;
  theme: Theme;
  options?: Options[];
}

export function FeedbackPanel({ answerResult, theme, options }: FeedbackPanelProps) {
  const correctAnswerText =
    options?.find((o) => String(o.id) === answerResult.correctAnswer)?.text ??
    answerResult.correctAnswer;
  return (
    <View
      style={{
        borderRadius: 20,
        borderWidth: 1,
        borderColor: answerResult.correct
          ? theme.success.default
          : theme.error.default,
        backgroundColor: answerResult.correct
          ? theme.success.subtle
          : theme.error.subtle,
        overflow: "hidden",
      }}
    >
      {/* Title row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: answerResult.correct ? 16 : 8,
        }}
      >
        {answerResult.correct ? (
          <CheckCircle size={24} color={theme.success.default} />
        ) : (
          <XCircle size={24} color={theme.error.default} />
        )}
        <View style={{ flex: 1, gap: 2 }}>
          <Text
            className="font-heading"
            style={{
              fontSize: 14,
              color: answerResult.correct
                ? theme.success.default
                : theme.error.default,
            }}
          >
            {answerResult.correct ? "Chính xác!" : "Sai rồi!"}
          </Text>
          {!answerResult.correct && (
            <View
              style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
            >
              <Text
                className="font-body"
                style={{ fontSize: 12, color: theme.text.secondary }}
              >
                Đáp án đúng:
              </Text>
              <Text
                className="font-heading"
                style={{ fontSize: 13, color: theme.success.default }}
              >
                {correctAnswerText}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Explanation */}
      {answerResult.explanation ? (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <Text
            className="font-body"
            style={{
              fontSize: 13,
              lineHeight: 19,
              color: theme.text.secondary,
            }}
          >
            {answerResult.explanation}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
