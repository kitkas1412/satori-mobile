import { ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { useEffect } from "react";
import {
  Alert,
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MarkdownText } from "@/components/ui";
import { useStartAssignment, useQuizNavigation, useQuizAnswers, useQuizTimer, useQuizSubmit } from "../hooks";
import { QuestionView } from "../components";

interface QuizScreenProps {
  id: string;
}

export function QuizScreen({ id }: QuizScreenProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const { mutate, data, isPending, isError } = useStartAssignment();

  const questions = data?.questions ?? [];
  const total = questions.length;

  const { currentIndex, isFirst, isLast, handleBack, handleNext } = useQuizNavigation(total);
  const { answers, handleSelectOption, handleFillBlankChange } = useQuizAnswers();
  const { getTimeStats } = useQuizTimer(!isPending && !!data);
  const { handleSubmit, isPending: isSubmitting } = useQuizSubmit({
    assignmentId: id,
    questions,
    answers,
    getTimeStats,
  });

  const current = questions[currentIndex];

  useEffect(() => {
    if (id) mutate(id);
  }, [id]);

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
        <MarkdownText
          fontSize={20}
          fontFamily="Nunito_700Bold"
          color={theme.textMuted}
          containerStyle={{ flex: 1 }}
        >
          {data?.title ?? "Bài tập"}
        </MarkdownText>
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
              onSelectOption={(optionId) => handleSelectOption(current.assignmentQuestionId, optionId)}
              onFillBlankChange={(text) => handleFillBlankChange(current.assignmentQuestionId, text)}
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
                backgroundColor: isFirst ? theme.border : theme.primary,
                opacity: isFirst ? 0.5 : 1,
              }}
            >
              <ChevronLeft
                size={20}
                color={isFirst ? theme.textMuted : theme.white}
                strokeWidth={2.5}
              />
              <Text
                className="font-heading text-base"
                style={{ color: isFirst ? theme.textMuted : theme.white }}
              >
                Quay lại
              </Text>
            </Pressable>

            <Pressable
              onPress={isLast ? handleSubmit : handleNext}
              disabled={isLast && isSubmitting}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl"
              style={{
                height: 52,
                backgroundColor: theme.primary,
                opacity: isLast && isSubmitting ? 0.6 : 1,
              }}
            >
              {isLast && isSubmitting ? (
                <ActivityIndicator color={theme.white} size="small" />
              ) : (
                <>
                  <Text
                    className="font-heading text-base"
                    style={{ color: theme.white }}
                  >
                    {isLast ? "Nộp bài" : "Tiếp theo"}
                  </Text>
                  {!isLast && (
                    <ChevronRight size={20} color={theme.white} strokeWidth={2.5} />
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
