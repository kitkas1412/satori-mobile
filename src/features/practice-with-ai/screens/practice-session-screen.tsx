// Màn hình luyện tập với AI — hiển thị từng câu hỏi trắc nghiệm.
// Luồng: khởi tạo session → người dùng chọn đáp án → xác nhận → câu tiếp theo
//        → hoàn thành → chuyển sang màn hình kết quả

import {
  CheckCircle,
  Flame,
  Lightbulb,
  X,
  XCircle,
  Zap,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { LoadingOverlay, PrimaryButton, ProgressBar } from "@/components/ui";
import { Colors, Primitive } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePracticeSession, useSubmitAnswer } from "../hooks";
import type {
  AnswerResponse,
  ItemType,
  Items,
  SessionType,
} from "../api/practice-with-ai.types";

const ITEM_TYPE_LABEL: Partial<Record<ItemType, string>> = {
  MULTIPLE_CHOICE: "Trắc nghiệm",
  FILL_BLANK: "Điền vào chỗ trống",
};

const SESSION_TYPE_LABEL: Record<SessionType, string> = {
  VOCAB_DRILL: "Từ vựng",
  GRAMMAR_DRILL: "Ngữ pháp",
  MIXED_LESSON: "Hỗn hợp",
  KANJI_READING: "Kanji",
  SENTENCE_BUILD: "Câu",
};

const OPTION_LETTERS = ["A", "B", "C", "D"];

type Theme = typeof Colors.light;

interface FillBlankSectionProps {
  currentItem: Items;
  selectedOptionId: number | null;
  answerResult: AnswerResponse | null;
  isSubmitting: boolean;
  theme: Theme;
  onSelectOption: (id: number) => void;
}

function FillBlankSection({
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
        : theme.border.default
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
            chipBorder = theme.brand.primary;
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
                    {answerResult.correctAnswer}
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
      )}
    </View>
  );
}

export function PracticeSessionScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const { lessonId, sessionType, questionCount, itemTypes } =
    useLocalSearchParams<{
      lessonId: string;
      sessionType: string;
      questionCount: string;
      itemTypes: string;
    }>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [answerResult, setAnswerResult] = useState<AnswerResponse | null>(null);

  const {
    mutate: startSession,
    data: sessionData,
    isPending: isInitializing,
    isError: isInitError,
  } = usePracticeSession();

  const { mutate: submitAnswer, isPending: isSubmitting } = useSubmitAnswer();

  useEffect(() => {
    console.log("[PracticeSession] isInitializing:", isInitializing);
  }, [isInitializing]);

  useEffect(() => {
    console.log("[PracticeSession] isSubmitting:", isSubmitting);
  }, [isSubmitting]);

  useEffect(() => {
    if (lessonId && sessionType && questionCount && itemTypes) {
      startSession({
        lessonId,
        sessionType: sessionType as SessionType,
        itemCount: parseInt(questionCount, 10),
        itemTypes: JSON.parse(itemTypes),
      });
    }
  }, []);

  function handleClose() {
    Alert.alert(
      "Kết thúc buổi học",
      "Tiến độ sẽ không được lưu. Bạn chắc chắn chứ?",
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Kết thúc",
          style: "destructive",
          onPress: () => router.replace("/(tabs)/practice"),
        },
      ],
    );
  }

  function handleConfirm() {
    if (!sessionData || !currentItem) return;

    // Phase 2: feedback đã hiển thị → chuyển câu tiếp
    if (answerResult !== null) {
      if (answerResult.sessionCompleted) {
        router.replace({
          pathname: "/practice-result",
          params: { practiceSessionId: sessionData.session.sessionId },
        });
      } else {
        setCurrentIndex((i) => i + 1);
        setSelectedOptionId(null);
        setAnswerResult(null);
        setShowHint(false);
      }
      return;
    }

    // Phase 1: submit câu trả lời
    if (selectedOptionId === null) return;
    const selectedOption = currentItem.options.find(
      (o) => o.id === selectedOptionId,
    );
    if (!selectedOption) return;

    submitAnswer(
      {
        sessionId: sessionData.session.sessionId,
        itemId: currentItem.id,
        userAnswer: selectedOption.text,
      },
      {
        onSuccess: (result) => {
          setStreak((s) => (result.correct ? s + 1 : 0));
          setAnswerResult(result);
        },
      },
    );
  }

  if (isInitError) {
    return (
      <View
        className="flex-1 items-center justify-center px-8 gap-4"
        style={{
          paddingTop: insets.top,
          backgroundColor: theme.background.page,
        }}
      >
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Text
          className="font-heading text-base text-center"
          style={{ color: theme.text.primary }}
        >
          Không thể khởi tạo phiên luyện tập
        </Text>
        <PrimaryButton
          text="Về trang luyện tập"
          onPress={() => router.replace("/(tabs)/practice")}
        />
      </View>
    );
  }

  const items = sessionData?.items ?? [];
  const session = sessionData?.session;
  const currentItem: Items | undefined = items[currentIndex];
  const totalItems = session?.totalItems ?? parseInt(questionCount ?? "0", 10);
  const progress = totalItems > 0 ? currentIndex / totalItems : 0;
  const sessionTypeLabel =
    SESSION_TYPE_LABEL[sessionType as SessionType] ?? sessionType;

  return (
    <>
      <View
        className="flex-1"
        style={{
          paddingTop: insets.top,
          backgroundColor: theme.background.page,
        }}
      >
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        <LoadingOverlay
          visible={isInitializing || isSubmitting}
          title="Đang xử lý..."
          message="Vui lòng đợi trong giây lát"
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: Math.max(insets.bottom, 16) + 92,
            gap: 16,
          }}
        >
          {/* Header row: X | badge + câu số | streak */}
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={24} color={theme.icon.primary} strokeWidth={2} />
            </TouchableOpacity>

            <View className="flex-1 items-center gap-[3px]">
              <View
                className="flex-row items-center gap-[5px] rounded-full"
                style={{
                  paddingHorizontal: 10.5,
                  paddingVertical: 1,
                  backgroundColor: theme.border.subtle,
                  borderWidth: 0.5,
                  borderColor: theme.brand.primary,
                }}
              >
                <Zap
                  size={10}
                  color={theme.brand.primary}
                  fill={theme.brand.primary}
                />
                <Text
                  className="font-heading"
                  style={{ fontSize: 11, color: theme.brand.primary }}
                >
                  {sessionTypeLabel}
                </Text>
              </View>
              <Text
                className="font-body text-xs"
                style={{ color: theme.text.secondary }}
              >
                Câu {currentIndex + 1} / {totalItems}
              </Text>
            </View>

            <View className="flex-row items-center gap-[3px]">
              <Flame
                size={14}
                color={Primitive.amber[300]}
                fill={Primitive.amber[300]}
              />
              <Text
                className="font-heading"
                style={{ fontSize: 16, color: Primitive.amber[300] }}
              >
                {streak}
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <ProgressBar progress={progress} height={6} />

          {/* Question card + options */}
          {currentItem && (
            <>
              {/* Question card */}
              <View
                style={{
                  borderRadius: 20,
                  paddingHorizontal: 20,
                  paddingVertical: 21,
                  gap: 14,
                  backgroundColor: theme.background.surface,
                  borderWidth: 1,
                  borderColor: theme.border.subtle,
                }}
              >
                {/* Item type label */}
                <View className="flex-row items-center gap-1.5">
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: theme.brand.primary,
                    }}
                  />
                  <Text
                    className="font-body"
                    style={{
                      fontSize: 11,
                      letterSpacing: 0.55,
                      color: theme.text.secondary,
                      textTransform: "uppercase",
                    }}
                  >
                    {ITEM_TYPE_LABEL[currentItem.itemType] ??
                      currentItem.itemType}
                  </Text>
                </View>

                {/* Question text */}
                <Text
                  className="font-heading"
                  style={{
                    fontSize: 18,
                    lineHeight: 26,
                    color: theme.text.primary,
                  }}
                >
                  {currentItem.itemType === "FILL_BLANK"
                    ? "Điền từ thích hợp vào chỗ trống để hoàn thành câu"
                    : currentItem.question}
                </Text>

                {/* Hint */}
                <View style={{ gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => setShowHint((v) => !v)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Lightbulb size={14} color={Primitive.amber[300]} />
                    <Text
                      className="font-body text-xs"
                      style={{ color: Primitive.amber[300] }}
                    >
                      {showHint ? "Ẩn gợi ý" : "Xem gợi ý"}
                    </Text>
                  </TouchableOpacity>
                  {showHint && currentItem.hint ? (
                    <View
                      style={{
                        borderWidth: 0.5,
                        borderColor: Primitive.amber[300],
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        backgroundColor: theme.background.surface,
                      }}
                    >
                      <Text
                        className="font-body"
                        style={{
                          fontSize: 13,
                          lineHeight: 19,
                          color: Primitive.amber[300],
                        }}
                      >
                        {currentItem.hint}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>

              {/* Answer options */}
              {currentItem.itemType === "MULTIPLE_CHOICE" ? (
                <View style={{ gap: 10 }}>
                  {currentItem.options.map((option, index) => {
                    const isSelected = selectedOptionId === option.id;
                    const isCorrectAnswer =
                      answerResult !== null &&
                      option.text === answerResult.correctAnswer;
                    const isWrongSelected =
                      answerResult !== null &&
                      isSelected &&
                      !answerResult.correct;

                    // Tính màu theo trạng thái
                    let borderColor = isSelected
                      ? theme.brand.primary
                      : theme.border.subtle;
                    let bgColor = isSelected
                      ? theme.brand.primary
                      : theme.background.surface;
                    let circleBg = isSelected
                      ? theme.brand.primary
                      : theme.background.surface;
                    let circleBorder = isSelected
                      ? theme.icon.onBrand
                      : theme.border.default;
                    let letterColor = isSelected
                      ? theme.icon.onBrand
                      : theme.icon.disabled;
                    let textColor = isSelected
                      ? theme.text.onBrand
                      : theme.text.disabled;

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
                        onPress={() => setSelectedOptionId(option.id)}
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
                            {OPTION_LETTERS[index] ?? String(index + 1)}
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
                          <CheckCircle
                            size={16}
                            color={theme.success.default}
                          />
                        )}
                        {isWrongSelected && (
                          <XCircle size={16} color={theme.error.default} />
                        )}
                      </TouchableOpacity>
                    );
                  })}

                  {/* Feedback panel */}
                  {answerResult !== null && (
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
                        marginTop: 6,
                      }}
                    >
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
                          <CheckCircle
                            size={24}
                            color={theme.success.default}
                          />
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
                              style={{
                                flexDirection: "row",
                                gap: 4,
                                alignItems: "center",
                              }}
                            >
                              <Text
                                className="font-body"
                                style={{
                                  fontSize: 12,
                                  color: theme.text.secondary,
                                }}
                              >
                                Đáp án đúng:
                              </Text>
                              <Text
                                className="font-heading"
                                style={{
                                  fontSize: 13,
                                  color: theme.success.default,
                                }}
                              >
                                {answerResult.correctAnswer}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      {answerResult.explanation ? (
                        <View
                          style={{ paddingHorizontal: 16, paddingBottom: 16 }}
                        >
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
                </View>
              ) : currentItem.itemType === "FILL_BLANK" ? (
                <FillBlankSection
                  currentItem={currentItem}
                  selectedOptionId={selectedOptionId}
                  answerResult={answerResult}
                  isSubmitting={isSubmitting}
                  theme={theme}
                  onSelectOption={setSelectedOptionId}
                />
              ) : (
                <View
                  className="rounded-2xl p-5 items-center justify-center"
                  style={{
                    backgroundColor: theme.background.surface,
                    borderWidth: 1,
                    borderColor: theme.border.subtle,
                    minHeight: 80,
                  }}
                >
                  <Text
                    className="font-body text-sm text-center"
                    style={{ color: theme.text.secondary }}
                  >
                    Loại câu hỏi này chưa được hỗ trợ
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Bottom sticky confirm button */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: Math.max(insets.bottom, 16) + 8,
            backgroundColor: theme.background.page,
          }}
        >
          <PrimaryButton
            text={answerResult !== null ? "Câu tiếp theo" : "Xác nhận"}
            onPress={handleConfirm}
            disabled={
              (selectedOptionId === null && answerResult === null) ||
              !currentItem
            }
            loading={isSubmitting}
          />
        </View>
      </View>
    </>
  );
}
