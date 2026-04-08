// Màn hình kết quả sau khi hoàn thành session hội thoại.
// Hiển thị theo thứ tự: điểm tổng → điểm chi tiết (3 chỉ số) → nhiệm vụ → đánh giá ngôn ngữ.
// Dữ liệu được đọc từ Zustand store (đã được lưu bởi completeSession).

import { TouchableOpacity, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { PrimaryButton, ScreenHeader, ScoreCircle } from "@/components/ui";
import { useConversationStore } from "@/stores";
import {
  LanguageEvaluationCard,
  MissionDetailsCard,
} from "@/features/speaking/components";
import { ChevronLeft } from "lucide-react-native";

export function ConversationFeedbackScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const feedback = useConversationStore((s) => s.feedback);

  /** Chuyển sang màn hình phần thưởng sau khi xem kết quả chi tiết */
  function handleContinue() {
    router.replace("/conversation-reward");
  }

  // Guard: nếu người dùng truy cập trực tiếp màn hình này mà không có dữ liệu feedback
  if (!feedback) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{
          backgroundColor: theme.background.page,
          paddingTop: insets.top,
        }}
      >
        <Text
          className="font-body text-base"
          style={{ color: theme.text.secondary }}
        >
          Không có dữ liệu phản hồi.
        </Text>
      </View>
    );
  }

  const {
    overallScore,
    missionScore,
    pronunciationScore,
    languageScore,
    missionDetails,
    languageEvaluation,
  } = feedback;

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: theme.background.page,
        paddingTop: insets.top + 16,
      }}
    >
      {/* Header */}
      <ScreenHeader
        title="Kết quả buổi học"
        titleSize="2xl"
        leftAction={
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronLeft size={24} color={theme.icon.primary} strokeWidth={2} />
          </TouchableOpacity>
        }
      />

      {/* Divider */}
      <View className="h-px" style={{ backgroundColor: theme.border.subtle }} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Score */}
        <View
          className="rounded-2xl border mt-4 p-6 items-center"
          style={{
            backgroundColor: theme.background.surface,
            borderColor: theme.border.subtle,
          }}
        >
          <Text
            className="font-body text-sm"
            style={{ color: theme.text.secondary }}
          >
            Điểm tổng
          </Text>
          <Text
            className="font-heading"
            style={{ fontSize: 48, color: theme.info.default }}
          >
            {overallScore != null ? Math.round(overallScore) : "--"}
          </Text>
          <Text
            className="font-body text-xs"
            style={{ color: theme.text.secondary }}
          >
            / 100
          </Text>
        </View>

        {/* Score Breakdown */}
        <View
          className="rounded-2xl p-4 border"
          style={{
            backgroundColor: theme.background.surface,
            borderColor: theme.border.subtle,
          }}
        >
          <Text
            className="font-heading text-base mb-4"
            style={{ color: theme.text.primary }}
          >
            Chi tiết điểm
          </Text>
          <View className="flex-row">
            <ScoreCircle score={missionScore} label="Nhiệm vụ" />
            <ScoreCircle score={pronunciationScore} label="Phát âm" />
            <ScoreCircle score={languageScore} label="Ngôn ngữ" />
          </View>
        </View>

        {/* Mission Details */}
        <MissionDetailsCard missionDetails={missionDetails} />

        {/* Language Evaluation */}
        {languageEvaluation && (
          <LanguageEvaluationCard languageEvaluation={languageEvaluation} />
        )}
      </ScrollView>

      {/* CTA */}
      <View
        className="px-4"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <PrimaryButton
          text="Tiếp tục"
          variant="dark"
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}
