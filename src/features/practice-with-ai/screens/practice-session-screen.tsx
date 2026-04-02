// Màn hình phiên luyện tập AI — hiển thị câu hỏi trắc nghiệm từng câu.

import { Flame, Lightbulb, X, Zap } from "lucide-react-native";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IconButton } from "@/components/ui/icon-button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { PrimaryButton } from "@/components/ui/button";
import {
  generateMockQuestions,
  type PracticeQuestion,
  type QuestionOption,
  type SessionType,
} from "@/features/practice-with-ai/api";

const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  vocabulary: "Từ vựng",
  grammar: "Ngữ pháp",
  kanji: "Kanji",
  combined: "Tổng hợp",
  sentence: "Xây dựng câu",
};

export function PracticeSessionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const { sessionType: rawSessionType, questionCount: rawCount } =
    useLocalSearchParams<{ lessonId: string; sessionType: string; questionCount: string }>();

  const sessionType = (rawSessionType ?? "vocabulary") as SessionType;
  const questionCount = Math.max(1, parseInt(rawCount ?? "5", 10));

  // Sinh câu hỏi một lần khi mount (useMemo không cần thiết — React Compiler xử lý)
  const [questions] = useState<PracticeQuestion[]>(() =>
    generateMockQuestions(sessionType, questionCount),
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);

  const total = questions.length;
  const question = questions[currentIndex];

  function handleSelectOption(optionId: string) {
    if (confirmed) return;
    setSelectedOptionId(optionId);
  }

  function handleConfirm() {
    if (!selectedOptionId || confirmed) return;

    const isCorrect =
      question.options.find((o) => o.id === selectedOptionId)?.isCorrect ?? false;

    setConfirmed(true);
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (currentIndex + 1 >= total) {
        router.back();
      } else {
        setCurrentIndex((i) => i + 1);
        setSelectedOptionId(null);
        setConfirmed(false);
      }
    }, 900);
  }

  function getOptionColors(opt: QuestionOption): {
    bg: string;
    border: string;
    labelBg: string;
    labelBorder: string;
    labelText: string;
    text: string;
  } {
    const isSelected = opt.id === selectedOptionId;

    if (!confirmed) {
      if (isSelected) {
        return {
          bg: theme.brand.primary,
          border: theme.brand.primary,
          labelBg: theme.brand.primary,
          labelBorder: theme.icon.onBrand,
          labelText: theme.icon.onBrand,
          text: theme.text.onBrand,
        };
      }
      return {
        bg: theme.background.surface,
        border: theme.border.subtle,
        labelBg: theme.background.surface,
        labelBorder: theme.border.default,
        labelText: theme.text.disabled,
        text: theme.text.disabled,
      };
    }

    // Trạng thái sau khi xác nhận
    if (opt.isCorrect) {
      return {
        bg: theme.success.bold,
        border: theme.success.bold,
        labelBg: theme.success.bold,
        labelBorder: theme.icon.onBrand,
        labelText: theme.icon.onBrand,
        text: theme.text.onBrand,
      };
    }
    if (isSelected && !opt.isCorrect) {
      return {
        bg: theme.error.bold,
        border: theme.error.bold,
        labelBg: theme.error.bold,
        labelBorder: theme.icon.onBrand,
        labelText: theme.icon.onBrand,
        text: theme.text.onBrand,
      };
    }
    return {
      bg: theme.background.surface,
      border: theme.border.subtle,
      labelBg: theme.background.surface,
      labelBorder: theme.border.default,
      labelText: theme.text.disabled,
      text: theme.text.disabled,
    };
  }

  if (!question) return null;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      {/* Header */}
      <View
        className="px-4 gap-4"
        style={{ paddingTop: insets.top + 16 }}
      >
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
            <Text className="font-body text-xs" style={{ color: theme.text.secondary }}>
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
        <ProgressBar progress={(currentIndex + (confirmed ? 1 : 0)) / total} height={6} />
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
            {question.text}
          </Text>

          {/* Hint button */}
          {question.hint && (
            <Pressable className="flex-row items-center gap-[6px]">
              <Lightbulb size={14} color={theme.text.secondary} strokeWidth={2} />
              <Text className="font-body text-xs" style={{ color: theme.text.secondary }}>
                Xem gợi ý
              </Text>
            </Pressable>
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
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        className="px-4 pt-1"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 4 }}
      >
        <PrimaryButton
          text="Xác nhận"
          onPress={handleConfirm}
          disabled={!selectedOptionId || confirmed}
        />
      </View>
    </View>
  );
}
