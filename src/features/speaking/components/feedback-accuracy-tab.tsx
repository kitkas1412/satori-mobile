import { View } from "react-native";
import { FeedbackScoreCard } from "./feedback-score-card";
import { FeedbackCard } from "./feedback-card";
import type { AccuracyResult } from "@/features/speaking/api/speaking.types";

interface FeedbackAccuracyTabProps {
  accuracy: AccuracyResult;
}

export function FeedbackAccuracyTab({ accuracy }: FeedbackAccuracyTabProps) {
  const errorRateDisplay = accuracy.errorRate != null ? `${accuracy.errorRate}%` : "N/A";

  return (
    <View className="gap-4">
      <FeedbackScoreCard
        title="Độ chính xác"
        score={accuracy.score}
        rows={[
          { label: "Tổng số sửa lỗi", value: accuracy.totalCorrections },
          { label: "Số tin nhắn", value: accuracy.userMessageCount },
          { label: "Tỷ lệ lỗi", value: errorRateDisplay },
        ]}
      />
      <FeedbackCard title="Nhận xét" text={accuracy.feedback} />
    </View>
  );
}
