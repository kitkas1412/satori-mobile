import { ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAssignmentDetail } from "../hooks";
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
  onSelectOption,
  theme,
}: {
  question: Question;
  index: number;
  total: number;
  selectedOptionId: string | undefined;
  onSelectOption: (optionId: string) => void;
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

      {/* Options */}
      <View className="gap-3">
        {question.options.map((option) => {
          const label = option.id === "TRUE" || option.id === "FALSE"
            ? option.id === "TRUE" ? "○" : "×"
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
    </ScrollView>
  );
}

export function QuizScreen({ id }: QuizScreenProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError } = useAssignmentDetail(id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = data?.questions ?? [];
  const total = questions.length;
  const current = questions[currentIndex];
  const isFirst = currentIndex === 0;

  function handleSelectOption(optionId: string) {
    if (!current) return;
    setAnswers((prev) => ({
      ...prev,
      [current.assignmentQuestionId]: optionId,
    }));
  }

  function handleBack() {
    if (!isFirst) setCurrentIndex((i) => i - 1);
  }

  function handleNext() {
    if (currentIndex < total - 1) setCurrentIndex((i) => i + 1);
  }

  return (
    <View className="flex-1 bg-background-default" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3 gap-3">
        <Pressable
          onPress={() => router.back()}
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
          Chọn đáp án đúng
        </Text>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: theme.border, opacity: 0.5 }} />

      {/* Content */}
      {isLoading ? (
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
              onSelectOption={handleSelectOption}
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
                backgroundColor: "#E2E8F0",
                opacity: isFirst ? 0.5 : 1,
              }}
            >
              <ChevronLeft size={20} color="#94A3B8" strokeWidth={2.5} />
              <Text
                className="font-heading text-base"
                style={{ color: "#94A3B8" }}
              >
                Quay lại
              </Text>
            </Pressable>

            <Pressable
              onPress={handleNext}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl"
              style={{ height: 52, backgroundColor: theme.primary }}
            >
              <Text
                className="font-heading text-base"
                style={{ color: "#FFFFFF" }}
              >
                Tiếp theo
              </Text>
              <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.5} />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}
