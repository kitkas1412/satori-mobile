import { Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { FeedbackScoreCard } from "./feedback-score-card";
import { FeedbackCard } from "./feedback-card";
import { FeedbackListCard } from "./feedback-list-card";
import { FeedbackWarningBanner } from "./feedback-warning-banner";
import type {
  AccuracyResult,
  TopCorrection,
} from "@/features/speaking/api/speaking.types";

interface FeedbackAccuracyTabProps {
  accuracy: AccuracyResult;
}

function formatSeverityCounts(counts: Record<string, number>): string {
  const entries = Object.entries(counts);
  if (entries.length === 0) return "Chưa có dữ liệu";
  return entries.map(([level, count]) => `${level}: ${count}`).join(", ");
}

function CorrectionItem({ item }: { item: TopCorrection }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View className="gap-1">
      <View className="flex-row flex-wrap items-center gap-2">
        <Text
          className="font-body text-xs"
          style={{
            color: theme.error.text,
            textDecorationLine: "line-through",
          }}
        >
          {item.original}
        </Text>
        <Text className="font-body text-xs" style={{ color: theme.text.tertiary }}>
          →
        </Text>
        <Text
          className="font-heading text-xs"
          style={{ color: theme.success.text }}
        >
          {item.corrected}
        </Text>
        {item.severity ? (
          <View
            className="rounded-full px-2 py-0.5"
            style={{ backgroundColor: theme.warning.subtle }}
          >
            <Text
              className="font-heading text-[10px]"
              style={{ color: theme.warning.text }}
            >
              {item.severity}
            </Text>
          </View>
        ) : null}
      </View>
      {item.explanation ? (
        <Text
          className="font-body text-xs leading-5"
          style={{ color: theme.text.secondary }}
        >
          {item.explanation}
        </Text>
      ) : null}
      {item.errorType ? (
        <Text
          className="font-body text-[11px]"
          style={{ color: theme.text.tertiary }}
        >
          Loại lỗi: {item.errorType}
        </Text>
      ) : null}
    </View>
  );
}

export function FeedbackAccuracyTab({ accuracy }: FeedbackAccuracyTabProps) {
  const errorRateDisplay =
    accuracy.errorRate != null ? `${accuracy.errorRate}%` : "N/A";

  const rows: { label: string; value: string | number }[] = [
    { label: "Tổng số sửa lỗi", value: accuracy.totalCorrections },
    { label: "Số tin nhắn", value: accuracy.userMessageCount },
    { label: "Tỷ lệ lỗi", value: errorRateDisplay },
  ];

  if (accuracy.totalClauses != null) {
    rows.push({ label: "Tổng số mệnh đề", value: accuracy.totalClauses });
  }
  if (accuracy.cleanClauses != null) {
    rows.push({ label: "Mệnh đề đúng", value: accuracy.cleanClauses });
  }
  if (accuracy.dirtyClauses != null) {
    rows.push({ label: "Mệnh đề lỗi", value: accuracy.dirtyClauses });
  }
  if (accuracy.severityCounts && Object.keys(accuracy.severityCounts).length > 0) {
    rows.push({
      label: "Mức độ lỗi",
      value: formatSeverityCounts(accuracy.severityCounts),
    });
  }

  return (
    <View className="gap-4">
      {accuracy.hasCriticalCommunicationBreakdown ? (
        <FeedbackWarningBanner
          variant="warning"
          text="Phiên này có lỗi nghiêm trọng làm gián đoạn giao tiếp. Hãy xem các sửa lỗi bên dưới."
        />
      ) : null}
      <FeedbackScoreCard title="Độ chính xác" score={accuracy.score} rows={rows} />
      {accuracy.topCorrections && accuracy.topCorrections.length > 0 ? (
        <FeedbackListCard
          title="Lỗi chính cần lưu ý"
          items={accuracy.topCorrections}
          renderItem={(item) => <CorrectionItem item={item} />}
        />
      ) : null}
      <FeedbackCard title="Nhận xét" text={accuracy.feedback} />
    </View>
  );
}
