import { Check, ChevronDown, ChevronUp, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ScoreRing } from "@/components/ui/score-ring";
import { usePracticeStore } from "@/stores";
import type { QuizDetail } from "../api";

function QuizDetailItem({
  item,
  index,
  theme,
}: {
  item: QuizDetail;
  index: number;
  theme: (typeof Colors)["light"];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      onPress={() => setExpanded((v) => !v)}
      className="bg-background-surface rounded-2xl overflow-hidden"
      style={{
        borderWidth: 1.5,
        borderColor: item.correct ? "#bbf7d0" : "#fecaca",
      }}
    >
      {/* Row: indicator + question text + chevron */}
      <View className="flex-row items-center gap-3 p-4">
        <View
          className="items-center justify-center rounded-full"
          style={{
            width: 28,
            height: 28,
            backgroundColor: item.correct ? "#dcfce7" : "#fee2e2",
            flexShrink: 0,
          }}
        >
          {item.correct ? (
            <Check size={14} color="#16a34a" strokeWidth={2.5} />
          ) : (
            <X size={14} color="#dc2626" strokeWidth={2.5} />
          )}
        </View>
        <Text
          className="font-body text-sm flex-1"
          style={{ color: theme.textDefault }}
          numberOfLines={expanded ? undefined : 2}
        >
          {index + 1}. {item.questionText}
        </Text>
        {expanded ? (
          <ChevronUp size={16} color={theme.textMuted} strokeWidth={2} />
        ) : (
          <ChevronDown size={16} color={theme.textMuted} strokeWidth={2} />
        )}
      </View>

      {/* Expanded detail */}
      {expanded && (
        <View
          className="px-4 pb-4 gap-2"
          style={{ borderTopWidth: 1, borderTopColor: item.correct ? "#bbf7d0" : "#fecaca" }}
        >
          {!item.correct && (
            <View className="gap-1 pt-3">
              <Text className="font-body text-xs" style={{ color: theme.textMuted }}>
                Bạn chọn:{" "}
                <Text style={{ color: "#dc2626" }}>{item.selectedAnswer}</Text>
              </Text>
              <Text className="font-body text-xs" style={{ color: theme.textMuted }}>
                Đáp án đúng:{" "}
                <Text style={{ color: "#16a34a" }}>{item.correctAnswer}</Text>
              </Text>
            </View>
          )}
          {item.correct && (
            <View className="pt-3">
              <Text className="font-body text-xs" style={{ color: theme.textMuted }}>
                Đáp án đúng:{" "}
                <Text style={{ color: "#16a34a" }}>{item.correctAnswer}</Text>
              </Text>
            </View>
          )}
          {!!item.explanation && (
            <View
              className="rounded-xl p-3"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <Text className="font-body text-xs" style={{ color: theme.textMuted }}>
                {item.explanation}
              </Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

export function QuizResultScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const quizResult = usePracticeStore((s) => s.quizResult);
  const assignmentId = usePracticeStore((s) => s.assignmentId);
  const clearQuizResult = usePracticeStore((s) => s.clearQuizResult);

  if (!quizResult) return null;

  const accuracy =
    quizResult.totalQuestions > 0
      ? Math.round((quizResult.correctCount / quizResult.totalQuestions) * 100)
      : 0;
  const wrongCount = quizResult.totalQuestions - quizResult.correctCount;
  const performanceLabel =
    quizResult.score >= 80 ? "Xuất sắc!" : quizResult.score >= 60 ? "Tốt!" : "Cố lên!";

  function handleContinue() {
    clearQuizResult();
    router.dismissAll();
  }

  return (
    <View className="flex-1 bg-background-default" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable
          onPress={handleContinue}
          hitSlop={8}
          className="items-center justify-center"
          style={{ width: 24, height: 24 }}
        >
          <X size={22} color={theme.textMuted} strokeWidth={2} />
        </Pressable>
        <Text className="font-heading text-xl" style={{ color: theme.textMuted }}>
          Kết quả
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: theme.border, opacity: 0.5 }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 40,
          paddingBottom: insets.bottom + 32,
          gap: 32,
        }}
      >
        {/* Score section */}
        <View className="items-center gap-2">
          <ScoreRing score={quizResult.score} />
          <Text className="font-heading text-2xl" style={{ color: theme.textDefault }}>
            {performanceLabel}
          </Text>
          <Text className="font-body text-sm text-center" style={{ color: theme.textMuted }}>
            Bạn đã hoàn thành bài tập
          </Text>
        </View>

        {/* Stats card */}
        <View
          className="bg-background-surface rounded-2xl p-5 gap-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <View className="flex-row justify-between">
            <View className="flex-row items-center gap-3">
              <View
                className="items-center justify-center rounded-full"
                style={{ width: 40, height: 40, backgroundColor: "#dcfce7" }}
              >
                <Check size={20} color="#16a34a" strokeWidth={2.5} />
              </View>
              <View>
                <Text className="font-body-bold text-sm" style={{ color: theme.textMuted }}>
                  Câu đúng
                </Text>
                <Text className="font-heading text-xl" style={{ color: theme.textDefault }}>
                  {quizResult.correctCount}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <View
                className="items-center justify-center rounded-full"
                style={{ width: 40, height: 40, backgroundColor: "#fee2e2" }}
              >
                <X size={20} color="#dc2626" strokeWidth={2.5} />
              </View>
              <View>
                <Text className="font-body-bold text-sm" style={{ color: theme.textMuted }}>
                  Câu sai
                </Text>
                <Text className="font-heading text-xl" style={{ color: theme.textDefault }}>
                  {wrongCount}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: "#e2e8f0" }} />

          <View className="flex-row items-center justify-between">
            <Text className="font-body-bold text-sm" style={{ color: theme.textMuted }}>
              Độ chính xác
            </Text>
            <Text className="font-heading text-lg" style={{ color: "#3b82f6" }}>
              {accuracy}%
            </Text>
          </View>
        </View>

        {/* Per-question breakdown */}
        {quizResult.quizDetails.length > 0 && (
          <View className="gap-3">
            <Text className="font-heading text-base" style={{ color: theme.textDefault }}>
              Chi tiết từng câu
            </Text>
            {quizResult.quizDetails.map((item, i) => (
              <QuizDetailItem key={item.questionId} item={item} index={i} theme={theme} />
            ))}
          </View>
        )}

        {/* Action button */}
        <Pressable
          onPress={handleContinue}
          className="flex-row items-center justify-center rounded-xl"
          style={{ height: 56, backgroundColor: theme.primary }}
        >
          <Text className="font-heading text-base" style={{ color: "#fff" }}>
            Tiếp tục
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
