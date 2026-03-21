// Màn hình làm bài trắc nghiệm.
// Tự động bắt đầu bài tập khi mount, hiển thị từng câu hỏi với thanh điều hướng
// và nút "Tiếp theo" / "Nộp bài" ở câu cuối.

import { ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { useEffect } from "react";
import {
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
import { LoadingOverlay, ScreenAsyncView, ScreenHeader } from "@/components/ui";
import { useStartAssignment, useQuizNavigation, useQuizAnswers, useQuizTimer, useQuizSubmit, useExitAssignment } from "../hooks";
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
  // Bắt đầu đếm giờ khi bài tập đã tải xong (isPending = false và data có giá trị)
  const { getTimeStats } = useQuizTimer(!isPending && !!data);
  const { handleSubmit, isPending: isSubmitting } = useQuizSubmit({
    assignmentId: id,
    questions,
    answers,
    getTimeStats,
  });
  const { handleExit } = useExitAssignment(() => router.back());

  const current = questions[currentIndex];

  // Tự động gọi API bắt đầu bài tập ngay khi màn hình được mount
  useEffect(() => {
    if (id) mutate(id);
  }, [id]);

  return (
    <View className="flex-1 bg-background-default" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />
      <LoadingOverlay visible={isPending} title="Đang tải bài tập..." />
      <LoadingOverlay visible={isSubmitting} title="Đang nộp bài..." />

      {/* Header với nút X để thoát bài */}
      <ScreenHeader
        title={data?.title ?? "Bài tập"}
        showDivider
        leftAction={
          <Pressable
            onPress={handleExit}
            hitSlop={8}
            className="items-center justify-center"
            style={{ width: 24, height: 24 }}
          >
            <X size={22} color={theme.textMuted} strokeWidth={2} />
          </Pressable>
        }
        rightAction={<View style={{ width: 24 }} />}
      />

      <ScreenAsyncView
        isLoading={false}
        isError={!isPending && (isError || !data)}
        isEmpty={!isPending && total === 0}
        errorText="Không thể tải bài tập. Vui lòng thử lại."
        emptyText="Bài tập này chưa có câu hỏi."
      >
        <>
          {/* Khu vực hiển thị câu hỏi hiện tại */}
          <View className="flex-1">
            {current && (
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
            )}
          </View>

          {/* Thanh điều hướng dưới cùng: nút Quay lại và Tiếp theo/Nộp bài */}
          <View
            className="flex-row gap-4 px-4"
            style={{ paddingBottom: insets.bottom + 16, paddingTop: 12 }}
          >
            {/* Nút Quay lại — bị vô hiệu hóa ở câu đầu tiên */}
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

            {/* Nút Tiếp theo (câu chưa cuối) hoặc Nộp bài (câu cuối) */}
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
      </ScreenAsyncView>
    </View>
  );
}
