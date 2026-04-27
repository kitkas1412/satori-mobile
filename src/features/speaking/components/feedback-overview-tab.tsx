import { Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { FeedbackCard } from "./feedback-card";
import type { QualitativeSummary } from "@/features/speaking/api/speaking.types";

interface FeedbackOverviewTabProps {
  qualitativeSummary: QualitativeSummary;
}

export function FeedbackOverviewTab({ qualitativeSummary }: FeedbackOverviewTabProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View className="gap-4">
      {/* Tóm tắt đánh giá */}
      <View
        className="rounded-xl p-4 gap-2 border"
        style={{
          backgroundColor: theme.background.surface,
          borderColor: theme.border.subtle,
        }}
      >
        <Text className="font-heading text-sm" style={{ color: theme.text.primary }}>
          Tóm tắt đánh giá
        </Text>
        <Text
          className="font-body text-xs leading-5"
          style={{ color: theme.text.secondary }}
        >
          {qualitativeSummary.overallAssessment}
        </Text>
        {qualitativeSummary.jlptEstimate ? (
          <View
            className="self-start rounded-md px-2 py-1"
            style={{ backgroundColor: theme.background.page }}
          >
            <Text className="font-body text-xs" style={{ color: theme.brand.primary }}>
              Ước tính: {qualitativeSummary.jlptEstimate}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Bước tiếp theo */}
      {qualitativeSummary.nextSteps?.length > 0 && (
        <View
          className="rounded-xl p-4 gap-2 border"
          style={{
            backgroundColor: theme.background.surface,
            borderColor: theme.border.subtle,
          }}
        >
          <Text className="font-heading text-sm" style={{ color: theme.text.primary }}>
            Bước tiếp theo
          </Text>
          <View className="gap-2">
            {qualitativeSummary.nextSteps.map((step, index) => (
              <View key={index} className="flex-row items-start gap-2">
                <View
                  className="rounded-full items-center justify-center shrink-0"
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: theme.brand.primary,
                  }}
                >
                  <Text
                    className="font-heading"
                    style={{ fontSize: 10, color: theme.text.onBrand }}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text
                  className="flex-1 font-body text-xs leading-5"
                  style={{ color: theme.text.secondary }}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {qualitativeSummary.recurringWarning ? (
        <FeedbackCard title="Lưu ý lặp lại" text={qualitativeSummary.recurringWarning} />
      ) : null}
    </View>
  );
}
