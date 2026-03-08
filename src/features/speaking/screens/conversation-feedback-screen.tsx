import { CheckCircle, Circle, ChevronRight } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { useConversationStore } from "@/stores";

function ScoreCircle({ score, label }: { score: number | null; label: string }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const displayScore = score != null ? Math.round(score) : "--";

  return (
    <View className="items-center gap-1 flex-1">
      <View
        className="w-16 h-16 rounded-full items-center justify-center border-2"
        style={{ borderColor: theme.primary }}
      >
        <Text className="font-heading text-xl" style={{ color: theme.primary }}>
          {displayScore}
        </Text>
      </View>
      <Text className="font-body text-xs text-center" style={{ color: theme.textMuted }}>
        {label}
      </Text>
    </View>
  );
}

export function ConversationFeedbackScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const feedback = useConversationStore((s) => s.feedback);
  const clearSession = useConversationStore((s) => s.clearSession);

  function handleGoHome() {
    clearSession();
    router.replace("/(tabs)/speaking");
  }

  if (!feedback) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.background, paddingTop: insets.top }}
      >
        <Text className="font-body text-base" style={{ color: theme.textMuted }}>
          Không có dữ liệu phản hồi.
        </Text>
      </View>
    );
  }

  const { overallScore, missionScore, pronunciationScore, languageScore, missionDetails, languageEvaluation } = feedback;

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: theme.background, paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="px-4 py-4">
        <Text className="font-heading text-2xl" style={{ color: theme.textDefault }}>
          Kết quả buổi học
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Score */}
        <View
          className="rounded-2xl p-6 items-center gap-2"
          style={{ backgroundColor: theme.cardBackground }}
        >
          <Text className="font-body text-sm" style={{ color: theme.textMuted }}>
            Điểm tổng
          </Text>
          <Text className="font-heading text-5xl" style={{ color: theme.primary }}>
            {overallScore != null ? Math.round(overallScore) : "--"}
          </Text>
          <Text className="font-body text-xs" style={{ color: theme.textMuted }}>
            / 100
          </Text>
        </View>

        {/* Score Breakdown */}
        <View
          className="rounded-2xl p-4"
          style={{ backgroundColor: theme.cardBackground }}
        >
          <Text className="font-heading text-base mb-4" style={{ color: theme.textDefault }}>
            Chi tiết điểm
          </Text>
          <View className="flex-row">
            <ScoreCircle score={missionScore} label="Nhiệm vụ" />
            <ScoreCircle score={pronunciationScore} label="Phát âm" />
            <ScoreCircle score={languageScore} label="Ngôn ngữ" />
          </View>
        </View>

        {/* Mission Details */}
        {missionDetails?.length > 0 && (
          <View
            className="rounded-2xl p-4 gap-3"
            style={{ backgroundColor: theme.cardBackground }}
          >
            <Text className="font-heading text-base" style={{ color: theme.textDefault }}>
              Nhiệm vụ
            </Text>
            {missionDetails.map((mission, index) => (
              <View key={index} className="flex-row items-start gap-3">
                {mission.status === "COMPLETED" ? (
                  <CheckCircle size={20} color={theme.success} />
                ) : (
                  <Circle size={20} color={theme.textMuted} />
                )}
                <View className="flex-1">
                  <Text className="font-body text-sm" style={{ color: theme.textDefault }}>
                    {mission.title}
                  </Text>
                  {mission.titleJapanese ? (
                    <Text className="font-body text-xs" style={{ color: theme.textMuted }}>
                      {mission.titleJapanese}
                    </Text>
                  ) : null}
                  {mission.reasoning ? (
                    <Text className="font-body text-xs mt-1" style={{ color: theme.textMuted }}>
                      {mission.reasoning}
                    </Text>
                  ) : null}
                </View>
                <Text className="font-body text-xs" style={{ color: theme.textMuted }}>
                  {mission.progressPct}%
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Language Evaluation */}
        {languageEvaluation && (
          <View
            className="rounded-2xl p-4 gap-3"
            style={{ backgroundColor: theme.cardBackground }}
          >
            <Text className="font-heading text-base" style={{ color: theme.textDefault }}>
              Đánh giá ngôn ngữ
            </Text>

            {/* Sub-scores */}
            <View className="flex-row flex-wrap gap-3">
              {[
                { label: "Lưu loát", val: languageEvaluation.fluencyScore },
                { label: "Chính xác", val: languageEvaluation.accuracyScore },
                { label: "Từ vựng", val: languageEvaluation.vocabularyScore },
                { label: "Ngữ pháp", val: languageEvaluation.grammarScore },
              ].map(({ label, val }) => (
                <View
                  key={label}
                  className="rounded-lg px-3 py-2 items-center"
                  style={{ backgroundColor: theme.background }}
                >
                  <Text className="font-heading text-sm" style={{ color: theme.primary }}>
                    {val != null ? Math.round(val) : "--"}
                  </Text>
                  <Text className="font-body text-xs" style={{ color: theme.textMuted }}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>

            {/* Summary */}
            {languageEvaluation.summary ? (
              <Text className="font-body text-sm" style={{ color: theme.textDefault }}>
                {languageEvaluation.summary}
              </Text>
            ) : null}

            {/* Strengths */}
            {languageEvaluation.strengths?.length > 0 && (
              <View className="gap-1">
                <Text className="font-heading text-sm" style={{ color: theme.success }}>
                  Điểm mạnh
                </Text>
                {languageEvaluation.strengths.map((s, i) => (
                  <Text key={i} className="font-body text-sm" style={{ color: theme.textDefault }}>
                    • {s}
                  </Text>
                ))}
              </View>
            )}

            {/* Improvements */}
            {languageEvaluation.improvements?.length > 0 && (
              <View className="gap-1">
                <Text className="font-heading text-sm" style={{ color: theme.secondary }}>
                  Cần cải thiện
                </Text>
                {languageEvaluation.improvements.map((s, i) => (
                  <Text key={i} className="font-body text-sm" style={{ color: theme.textDefault }}>
                    • {s}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* CTA */}
      <View
        className="px-4"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <TouchableOpacity
          onPress={handleGoHome}
          className="bg-primary-dark rounded-xl py-4 items-center"
          activeOpacity={0.85}
        >
          <Text className="font-heading text-base" style={{ color: theme.white }}>
            Về trang luyện nói
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
