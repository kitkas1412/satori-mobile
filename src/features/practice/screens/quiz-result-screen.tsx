// Màn hình kết quả bài trắc nghiệm.
// Hiển thị điểm số, nhãn đánh giá, thống kê đúng/sai và chi tiết đáp án từng câu.

import { Check, X } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { PrimaryButton, ScoreRing, ScreenHeader } from "@/components/ui";
import { useQuizResult } from "../hooks";
import { QuizAnswerItem } from "../components";

export function QuizResultScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const result = useQuizResult();

  // Không render nếu chưa có kết quả trong store (tránh màn hình trắng)
  if (!result) return null;

  const { quizResult, wrongCount, performanceLabel, handleContinue } = result;

  return (
    <View
      className="flex-1 bg-background-default"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar style="dark" />

      {/* Header với nút X để quay về danh sách bài tập */}
      <ScreenHeader
        title="Kết quả"
        showDivider
        leftAction={
          <Pressable
            onPress={handleContinue}
            hitSlop={8}
            className="items-center justify-center"
            style={{ width: 24, height: 24 }}
          >
            <X size={22} color={theme.textMuted} strokeWidth={2} />
          </Pressable>
        }
        rightAction={<View style={{ width: 24 }} />}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 40,
          paddingBottom: insets.bottom + 32,
          gap: 32,
        }}
      >
        {/* Phần điểm số: vòng tròn điểm + nhãn đánh giá */}
        <View className="items-center gap-2">
          <ScoreRing score={quizResult.score} />
          <Text
            className="font-heading text-2xl"
            style={{ color: theme.textDefault }}
          >
            {performanceLabel}
          </Text>
          <Text
            className="font-body text-sm text-center"
            style={{ color: theme.textMuted }}
          >
            Bạn đã hoàn thành bài tập
          </Text>
        </View>

        {/* Thẻ thống kê: số câu đúng và số câu sai */}
        <View
          className="bg-background-surface rounded-2xl p-5 gap-4"
          style={{
            shadowColor: theme.shadow,
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
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: theme.success,
                }}
              >
                <Check size={20} color={theme.white} strokeWidth={2.5} />
              </View>
              <View>
                <Text
                  className="font-body-bold text-sm"
                  style={{ color: theme.textMuted }}
                >
                  Câu đúng
                </Text>
                <Text
                  className="font-heading text-xl"
                  style={{ color: theme.textDefault }}
                >
                  {quizResult.correctCount}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <View
                className="items-center justify-center rounded-full"
                style={{ width: 40, height: 40, backgroundColor: theme.error }}
              >
                <X size={20} color={theme.white} strokeWidth={2.5} />
              </View>
              <View>
                <Text
                  className="font-body-bold text-sm"
                  style={{ color: theme.textMuted }}
                >
                  Câu sai
                </Text>
                <Text
                  className="font-heading text-xl"
                  style={{ color: theme.textDefault }}
                >
                  {wrongCount}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chi tiết đáp án từng câu — chỉ hiển thị nếu có dữ liệu */}
        {quizResult.quizDetails.length > 0 && (
          <View className="gap-3">
            <Text
              className="font-heading text-base"
              style={{ color: theme.textDefault }}
            >
              Đáp án từng câu
            </Text>
            {quizResult.quizDetails.map((item, i) => (
              <QuizAnswerItem
                key={item.questionId}
                item={item}
                index={i}
                theme={theme}
              />
            ))}
          </View>
        )}

        {/* Nút quay về danh sách bài tập */}
        <PrimaryButton text="Quay về" onPress={handleContinue} />
      </ScrollView>
    </View>
  );
}
