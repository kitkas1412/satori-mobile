import { ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useStartAssignment, useSubmitAssignment } from "../hooks";
import { usePracticeStore } from "@/stores";
import type { Question, QuestionOption } from "../api";

interface QuizScreenProps {
  id: string;
}

function OptionButton({
  option,
  label,
  selected,
  onPress,
  theme,
}: {
  option: QuestionOption;
  label: string;
  selected: boolean;
  onPress: () => void;
  theme: (typeof Colors)["light"];
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 rounded-xl p-4 bg-background-surface"
      style={{
        borderWidth: selected ? 2 : 1.5,
        borderColor: selected ? theme.primary : theme.border,
        backgroundColor: selected ? "#EFF6FF" : "#FFFFFF",
      }}
    >
      <View
        className="items-center justify-center"
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          borderWidth: selected ? 2 : 1.5,
          borderColor: selected ? theme.primary : theme.border,
          backgroundColor: selected ? theme.primary : "transparent",
        }}
      >
        <Text
          className="font-heading text-sm text-center"
          style={{ color: selected ? "#FFFFFF" : theme.textMuted }}
        >
          {label}
        </Text>
      </View>
      <Text
        className="font-body text-base flex-1"
        style={{ color: selected ? theme.primary : theme.textMuted }}
      >
        {option.text}
      </Text>
    </Pressable>
  );
}

function QuestionView({
  question,
  index,
  total,
  selectedOptionId,
  fillBlankAnswer,
  onSelectOption,
  onFillBlankChange,
  theme,
}: {
  question: Question;
  index: number;
  total: number;
  selectedOptionId: string | undefined;
  fillBlankAnswer: string | undefined;
  onSelectOption: (optionId: string) => void;
  onFillBlankChange: (text: string) => void;
  theme: (typeof Colors)["light"];
}) {
  const progressPct = (index + 1) / total;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, paddingTop: 16 }}
    >
      {/* Question counter */}
      <View className="flex-row items-center justify-between mb-3">
        <Text
          className="font-heading text-sm"
          style={{ color: theme.textMuted }}
        >
          問題
        </Text>
        <Text
          className="font-heading text-sm"
          style={{ color: theme.textMuted }}
        >
          {index + 1}/{total}
        </Text>
      </View>

      {/* Progress bar */}
      <View
        className="h-2 rounded-full overflow-hidden mb-6"
        style={{ backgroundColor: "#E2E8F0" }}
      >
        <View
          className="h-full rounded-full"
          style={{
            backgroundColor: theme.primary,
            width: `${progressPct * 100}%`,
          }}
        />
      </View>

      {/* Question card */}
      <View
        className="bg-background-surface rounded-2xl p-5 mb-6"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <Text
          className="font-heading text-lg"
          style={{ color: theme.textDefault }}
        >
          {question.questionText}
        </Text>
      </View>

      {/* Answer area */}
      {question.questionType === "fill_blank" ? (
        <TextInput
          value={fillBlankAnswer ?? ""}
          onChangeText={onFillBlankChange}
          placeholder="Nhập câu trả lời..."
          placeholderTextColor={theme.textMuted}
          className="font-body text-base rounded-xl p-4"
          style={{
            borderWidth: 1.5,
            borderColor: fillBlankAnswer ? theme.primary : theme.border,
            backgroundColor: fillBlankAnswer ? "#EFF6FF" : "#FFFFFF",
            color: theme.textDefault,
          }}
        />
      ) : (
        <View className="gap-3">
          {(question.options ?? []).map((option) => {
            const label =
              option.id === "TRUE" || option.id === "FALSE"
                ? option.id === "TRUE"
                  ? "○"
                  : "×"
                : option.id;
            return (
              <OptionButton
                key={option.id}
                option={option}
                label={label}
                selected={selectedOptionId === option.id}
                onPress={() =>
                  onSelectOption(
                    selectedOptionId === option.id ? "" : option.id,
                  )
                }
                theme={theme}
              />
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}


export function QuizScreen({ id }: QuizScreenProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const { mutate, data, isPending, isError } = useStartAssignment();
  const submitMutation = useSubmitAssignment();
  const startedAtRef = useRef<number>(0);

  const setQuizResult = usePracticeStore((s) => s.setQuizResult);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) mutate(id);
  }, [id]);

  useEffect(() => {
    if (!isPending && data && startedAtRef.current === 0) {
      startedAtRef.current = Date.now();
    }
  }, [isPending, data]);

  const questions = data?.questions ?? [];
  const total = questions.length;
  const current = questions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  function handleSelectOption(optionId: string) {
    if (!current) return;
    setAnswers((prev) => ({
      ...prev,
      [current.assignmentQuestionId]: optionId,
    }));
  }

  function handleFillBlankChange(text: string) {
    if (!current) return;
    setAnswers((prev) => ({
      ...prev,
      [current.assignmentQuestionId]: text,
    }));
  }

  function handleBack() {
    if (!isFirst) setCurrentIndex((i) => i - 1);
  }

  function handleNext() {
    if (currentIndex < total - 1) setCurrentIndex((i) => i + 1);
  }

  function handleSubmit() {
    if (!data) return;
    const timeSpentSeconds = Math.max(
      1,
      Math.round((Date.now() - startedAtRef.current) / 1000),
    );
    const timePerQuestion = Math.round(timeSpentSeconds / total);
    const answersPayload = data.questions.map((q) => ({
      questionId: q.questionId,
      selectedAnswer: answers[q.assignmentQuestionId] ?? "",
      timeSpent: timePerQuestion,
    }));
    submitMutation.mutate(
      {
        assignmentId: id,
        body: {
          answers: JSON.stringify(answersPayload),
          timeSpentSeconds,
        },
      },
      {
        onSuccess: (result) => {
          setQuizResult(id, result);
          router.push("/assignment-result");
        },
        onError: () => {
          Alert.alert("Lỗi", "Không thể nộp bài. Vui lòng thử lại.");
        },
      },
    );
  }

  return (
    <View className="flex-1 bg-background-default" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3 gap-3">
        <Pressable
          onPress={() =>
            Alert.alert(
              "Thoát bài tập?",
              "Tiến độ của bạn sẽ không được lưu.",
              [
                { text: "Tiếp tục làm", style: "cancel" },
                { text: "Thoát", style: "destructive", onPress: () => router.back() },
              ],
            )
          }
          hitSlop={8}
          className="items-center justify-center"
          style={{ width: 24, height: 24 }}
        >
          <X size={22} color={theme.textMuted} strokeWidth={2} />
        </Pressable>
        <Text
          className="font-heading text-xl flex-1"
          style={{ color: theme.textMuted }}
        >
          {data?.title ?? "Bài tập"}
        </Text>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: theme.border, opacity: 0.5 }} />

      {/* Content */}
      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={theme.primary} />
        </View>
      ) : isError || !data ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text
            className="font-body text-sm text-center"
            style={{ color: theme.textMuted }}
          >
            Không thể tải bài tập. Vui lòng thử lại.
          </Text>
        </View>
      ) : total === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text
            className="font-body text-sm text-center"
            style={{ color: theme.textMuted }}
          >
            Bài tập này chưa có câu hỏi.
          </Text>
        </View>
      ) : (
        <>
          <View className="flex-1">
            <QuestionView
              question={current}
              index={currentIndex}
              total={total}
              selectedOptionId={answers[current.assignmentQuestionId]}
              fillBlankAnswer={answers[current.assignmentQuestionId]}
              onSelectOption={handleSelectOption}
              onFillBlankChange={handleFillBlankChange}
              theme={theme}
            />
          </View>

          {/* Bottom action bar */}
          <View
            className="flex-row gap-4 px-4"
            style={{ paddingBottom: insets.bottom + 16, paddingTop: 12 }}
          >
            <Pressable
              onPress={handleBack}
              disabled={isFirst}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl"
              style={{
                height: 52,
                backgroundColor: isFirst ? "#E2E8F0" : theme.primary,
                opacity: isFirst ? 0.5 : 1,
              }}
            >
              <ChevronLeft
                size={20}
                color={isFirst ? "#94A3B8" : "#FFFFFF"}
                strokeWidth={2.5}
              />
              <Text
                className="font-heading text-base"
                style={{ color: isFirst ? "#94A3B8" : "#FFFFFF" }}
              >
                Quay lại
              </Text>
            </Pressable>

            <Pressable
              onPress={isLast ? handleSubmit : handleNext}
              disabled={isLast && submitMutation.isPending}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl"
              style={{
                height: 52,
                backgroundColor: theme.primary,
                opacity: isLast && submitMutation.isPending ? 0.6 : 1,
              }}
            >
              {isLast && submitMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text
                    className="font-heading text-base"
                    style={{ color: "#FFFFFF" }}
                  >
                    {isLast ? "Nộp bài" : "Tiếp theo"}
                  </Text>
                  {!isLast && (
                    <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.5} />
                  )}
                </>
              )}
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}
