// Màn hình phiên luyện tập AI — hiển thị câu hỏi trắc nghiệm từng câu.

import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  CircleCheck,
  CircleX,
  Flame,
  Lightbulb,
  X,
  Zap,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Colors } from "@/constants/theme";
import type {
  AnswerResponse,
  ItemType,
  SessionType,
} from "@/features/practice-with-ai/api";
import {
  usePracticeSession,
  useSubmitAnswer,
} from "@/features/practice-with-ai/hooks";
import { useColorScheme } from "@/hooks/use-color-scheme";

const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  VOCAB_DRILL: "Từ vựng",
  GRAMMAR_DRILL: "Ngữ pháp",
  KANJI_READING: "Kanji",
  MIXED_LESSON: "Tổng hợp",
  SENTENCE_BUILD: "Xây dựng câu",
};

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

interface DisplayOption {
  id: string;
  label: (typeof OPTION_LABELS)[number];
  text: string;
}

interface DisplayQuestion {
  id: string;
  question: string;
  hint?: string;
  options: DisplayOption[];
}

export function PracticeSessionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const {
    lessonId,
    sessionType: rawSessionType,
    questionCount: rawCount,
    itemType: rawItemType,
  } = useLocalSearchParams<{
    lessonId: string;
    sessionType: string;
    questionCount: string;
    itemType: string;
  }>();

  const sessionType = (rawSessionType ?? "VOCAB_DRILL") as SessionType;
  const itemCount = Math.max(1, parseInt(rawCount ?? "5", 10));
  const itemType = (rawItemType ?? "MULTIPLE_CHOICE") as ItemType;

  const { mutate, data, isPending, isError, reset } = usePracticeSession();
  const { mutate: submitAnswer, isPending: isSubmitting } = useSubmitAnswer();

  useEffect(() => {
    mutate({
      lessonId: lessonId ?? "",
      sessionType,
      itemCount,
      itemTypes: [itemType],
    });
  }, []);

  const questions: DisplayQuestion[] = (data?.items ?? []).map((item) => ({
    id: item.id,
    question: item.question,
    hint: item.hint || undefined,
    options: item.options.map((opt, idx) => ({
      id: `${item.id}-${idx}`,
      label: OPTION_LABELS[idx] ?? "A",
      text: opt.text,
    })),
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answerResult, setAnswerResult] = useState<AnswerResponse | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [isNavigatingToResult, setIsNavigatingToResult] = useState(false);

  // Reset question state when new data arrives
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setConfirmed(false);
    setAnswerResult(null);
    setHintVisible(false);
    setScore(0);
    setIsNavigatingToResult(false);
  }, [data]);

  const total = questions.length;
  const question = questions[currentIndex];
  const sessionId = data?.session.sessionId ?? "";
  const isSessionCompleted =
    !!answerResult &&
    (answerResult.sessionCompleted || currentIndex + 1 >= total);

  function handleSelectOption(optionId: string) {
    if (confirmed) return;
    setSelectedOptionId(optionId);
  }

  function handleConfirm() {
    if (!selectedOptionId || confirmed || isSubmitting) return;

    const selectedOption = question.options.find(
      (o) => o.id === selectedOptionId,
    );
    if (!selectedOption) return;

    setConfirmed(true);

    submitAnswer(
      {
        sessionId,
        itemId: question.id,
        userAnswer: selectedOption.text,
      },
      {
        onSuccess: (result) => {
          setAnswerResult(result);
          if (result.correct) setScore((s) => s + 1);
        },
        onError: () => {
          setConfirmed(false);
        },
      },
    );
  }

  function handleNext() {
    if (isSessionCompleted) {
      if (isNavigatingToResult) return;
      if (!sessionId) {
        router.back();
        return;
      }

      setIsNavigatingToResult(true);
      router.push({
        pathname: "/practice-result",
        params: { practiceSessionId: sessionId },
      });
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOptionId(null);
      setConfirmed(false);
      setAnswerResult(null);
      setHintVisible(false);
    }
  }

  function getOptionColors(opt: DisplayOption): {
    bg: string;
    border: string;
    labelBg: string;
    labelBorder: string;
    labelText: string;
    text: string;
    showCheck: boolean;
  } {
    const isSelected = opt.id === selectedOptionId;
    const isCorrectAnswer =
      confirmed && answerResult?.correctAnswer === opt.text;
    const isWrongSelected =
      confirmed && isSelected && answerResult !== null && !answerResult.correct;

    if (!confirmed) {
      if (isSelected) {
        return {
          bg: theme.brand.primary,
          border: theme.brand.primary,
          labelBg: theme.brand.primary,
          labelBorder: theme.icon.onBrand,
          labelText: theme.icon.onBrand,
          text: theme.text.onBrand,
          showCheck: false,
        };
      }
      return {
        bg: theme.background.surface,
        border: theme.border.subtle,
        labelBg: theme.background.surface,
        labelBorder: theme.border.default,
        labelText: theme.text.disabled,
        text: theme.text.disabled,
        showCheck: false,
      };
    }

    if (isCorrectAnswer) {
      return {
        bg: theme.success.subtle,
        border: theme.success.default,
        labelBg: theme.success.default,
        labelBorder: theme.success.default,
        labelText: theme.icon.onBrand,
        text: theme.text.primary,
        showCheck: true,
      };
    }
    if (isWrongSelected) {
      return {
        bg: theme.error.subtle,
        border: theme.error.default,
        labelBg: theme.error.default,
        labelBorder: theme.error.default,
        labelText: theme.icon.onBrand,
        text: theme.error.default,
        showCheck: false,
      };
    }
    return {
      bg: theme.background.surface,
      border: theme.border.subtle,
      labelBg: theme.background.surface,
      labelBorder: theme.border.default,
      labelText: theme.text.disabled,
      text: theme.text.disabled,
      showCheck: false,
    };
  }

  // --- Error state ---
  if (isError) {
    return (
      <View
        className="flex-1 items-center justify-center px-8 gap-4"
        style={{ backgroundColor: theme.background.page }}
      >
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Text
          className="font-heading text-base text-center"
          style={{ color: theme.text.primary }}
        >
          Không thể tải bài luyện tập
        </Text>
        <Text
          className="font-body text-sm text-center"
          style={{ color: theme.text.secondary }}
        >
          Vui lòng kiểm tra kết nối và thử lại.
        </Text>
        <Pressable
          onPress={() => {
            reset();
            mutate({
              lessonId: lessonId ?? "",
              sessionType,
              itemCount,
              itemTypes: [itemType],
            });
          }}
          className="px-6 py-3 rounded-2xl"
          style={{ backgroundColor: theme.brand.primary }}
        >
          <Text
            className="font-heading text-sm"
            style={{ color: theme.text.onBrand }}
          >
            Thử lại
          </Text>
        </Pressable>
        <Pressable onPress={() => router.back()}>
          <Text
            className="font-body text-sm"
            style={{ color: theme.text.secondary }}
          >
            Quay lại
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!question) return null;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <LoadingOverlay
        visible={isPending}
        title="Đang tải bài luyện tập"
        message="Vui lòng đợi trong giây lát"
      />

      {/* Header */}
      <View className="px-4 gap-4" style={{ paddingTop: insets.top + 16 }}>
        {/* Row: X | badge + counter | flame + score */}
        <View className="flex-row items-center">
          <IconButton
            icon={<X size={24} color={theme.icon.primary} strokeWidth={2} />}
            onPress={() => router.back()}
          />

          {/* Center */}
          <View className="flex-1 items-center gap-[3px]">
            {/* Badge loại session */}
            <View
              className="flex-row items-center gap-[5px] px-[10px] py-[2px] rounded-full border"
              style={{
                backgroundColor: theme.border.subtle,
                borderColor: theme.brand.primary,
              }}
            >
              <Zap size={10} color={theme.brand.primary} strokeWidth={2.5} />
              <Text
                className="font-heading"
                style={{ fontSize: 11, color: theme.brand.primary }}
              >
                {SESSION_TYPE_LABELS[sessionType]}
              </Text>
            </View>
            {/* Số câu */}
            <Text
              className="font-body text-xs"
              style={{ color: theme.text.secondary }}
            >
              Câu {currentIndex + 1} / {total}
            </Text>
          </View>

          {/* Score */}
          <View className="flex-row items-center gap-1">
            <Flame
              size={18}
              color={Colors.primitive.amber[300]}
              strokeWidth={2}
              fill={Colors.primitive.amber[300]}
            />
            <Text
              className="font-heading"
              style={{ fontSize: 16, color: Colors.primitive.amber[300] }}
            >
              {score}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <ProgressBar
          progress={(currentIndex + (confirmed ? 1 : 0)) / total}
          height={6}
        />
      </View>

      {/* Body */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 16 }}
      >
        {/* Question card */}
        <View
          className="rounded-[20px] px-5 py-[21px] gap-3.5"
          style={{
            backgroundColor: theme.background.surface,
            borderWidth: 1,
            borderColor: theme.border.subtle,
          }}
        >
          {/* Type label */}
          <View className="flex-row items-center gap-[6px]">
            <View
              className="rounded-full"
              style={{
                width: 6,
                height: 6,
                backgroundColor: theme.brand.primary,
              }}
            />
            <Text
              className="font-body"
              style={{
                fontSize: 11,
                color: theme.text.secondary,
                letterSpacing: 0.55,
                textTransform: "uppercase",
              }}
            >
              Trắc nghiệm
            </Text>
          </View>

          {/* Question text */}
          <Text
            className="font-heading"
            style={{ fontSize: 18, lineHeight: 26, color: theme.text.primary }}
          >
            {question.question}
          </Text>

          {/* Hint section */}
          {question.hint && (
            <View className="gap-[10px]">
              <Pressable
                className="flex-row items-center gap-[6px]"
                onPress={() => setHintVisible((v) => !v)}
              >
                <Lightbulb
                  size={14}
                  color={Colors.primitive.amber[300]}
                  strokeWidth={2}
                />
                <Text
                  className="font-body text-xs"
                  style={{ color: Colors.primitive.amber[300] }}
                >
                  {hintVisible ? "Ẩn gợi ý" : "Xem gợi ý"}
                </Text>
              </Pressable>
              {hintVisible && (
                <View
                  className="rounded-xl px-3 py-2"
                  style={{
                    backgroundColor: theme.background.surface,
                    borderWidth: 0.5,
                    borderColor: Colors.primitive.amber[300],
                  }}
                >
                  <Text
                    className="font-body"
                    style={{
                      fontSize: 13,
                      lineHeight: 19,
                      color: Colors.primitive.amber[300],
                    }}
                  >
                    {question.hint}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Options */}
        <View style={{ gap: 10 }}>
          {question.options.map((opt) => {
            const colors = getOptionColors(opt);
            return (
              <Pressable
                key={opt.id}
                onPress={() => handleSelectOption(opt.id)}
                className="flex-row items-center rounded-[16px]"
                style={{
                  height: 62,
                  paddingHorizontal: 17,
                  gap: 14,
                  backgroundColor: colors.bg,
                  borderWidth: 1.23,
                  borderColor: colors.border,
                }}
              >
                {/* Label circle */}
                <View
                  className="rounded-full items-center justify-center"
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: colors.labelBg,
                    borderWidth: 1,
                    borderColor: colors.labelBorder,
                  }}
                >
                  <Text
                    className="font-heading"
                    style={{ fontSize: 13, color: colors.labelText }}
                  >
                    {opt.label}
                  </Text>
                </View>

                {/* Option text */}
                <Text
                  className="font-heading flex-1"
                  style={{ fontSize: 15, lineHeight: 22, color: colors.text }}
                  numberOfLines={2}
                >
                  {opt.text}
                </Text>

                {/* Checkmark icon for correct answer */}
                {colors.showCheck && (
                  <CircleCheck
                    size={16}
                    color={theme.success.default}
                    strokeWidth={2}
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Feedback panel */}
        {confirmed && answerResult && (
          <View
            className="rounded-[20px] overflow-hidden"
            style={{
              backgroundColor: answerResult.correct
                ? theme.success.subtle
                : theme.error.subtle,
              borderWidth: 1,
              borderColor: answerResult.correct
                ? theme.success.default
                : theme.error.default,
            }}
          >
            {/* Header row */}
            <View
              className="flex-row items-center gap-[10px] px-4"
              style={{ height: 60 }}
            >
              {answerResult.correct ? (
                <CircleCheck
                  size={24}
                  color={theme.success.default}
                  strokeWidth={2}
                />
              ) : (
                <CircleX
                  size={24}
                  color={theme.error.default}
                  strokeWidth={2}
                />
              )}
              <View className="flex-1 gap-[1px]">
                <Text
                  className="font-heading"
                  style={{
                    fontSize: 14,
                    lineHeight: 19,
                    color: answerResult.correct
                      ? theme.success.default
                      : theme.error.default,
                  }}
                >
                  {answerResult.correct ? "Đúng rồi!" : "Sai rồi!"}
                </Text>
                {!answerResult.correct && (
                  <View className="flex-row items-center gap-1">
                    <Text
                      className="font-body"
                      style={{
                        fontSize: 12,
                        lineHeight: 16,
                        color: theme.text.secondary,
                      }}
                    >
                      Đáp án đúng:
                    </Text>
                    <Text
                      className="font-body"
                      style={{
                        fontSize: 12,
                        lineHeight: 16,
                        color: theme.success.default,
                      }}
                    >
                      {answerResult.correctAnswer}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Explanation */}
            {answerResult.explanation ? (
              <View className="px-4 pb-4">
                <Text
                  className="font-body"
                  style={{
                    fontSize: 12,
                    lineHeight: 18,
                    color: theme.text.secondary,
                  }}
                >
                  {answerResult.explanation}
                </Text>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View
        className="px-4 pt-1"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 4 }}
      >
        <PrimaryButton
          text={
            confirmed
              ? isSessionCompleted
                ? "Tiếp tục"
                : "Câu tiếp theo"
              : "Xác nhận"
          }
          onPress={confirmed ? handleNext : handleConfirm}
          disabled={
            !confirmed
              ? !selectedOptionId || isSubmitting
              : isNavigatingToResult || isSubmitting
          }
        />
      </View>
    </View>
  );
}
