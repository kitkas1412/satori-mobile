import { View } from "react-native";
import { FeedbackScoreCard } from "./feedback-score-card";
import { FeedbackCard } from "./feedback-card";
import type { PronunciationResult } from "@/features/speaking/api/speaking.types";

interface FeedbackPronunciationTabProps {
  pronunciation: PronunciationResult;
  pronunciationFeedback: string;
}

export function FeedbackPronunciationTab({
  pronunciation,
  pronunciationFeedback,
}: FeedbackPronunciationTabProps) {
  return (
    <View className="gap-4">
      <FeedbackScoreCard
        title="Phát âm"
        score={pronunciation.score}
        rows={[
          { label: "Độ chính xác trung bình", value: `${pronunciation.averageAccuracy}%` },
          { label: "Độ trôi chảy trung bình", value: `${pronunciation.averageFluency}%` },
          { label: "Độ hoàn chỉnh trung bình", value: `${pronunciation.averageCompleteness}%` },
          { label: "Tổng số đánh giá", value: pronunciation.totalAssessed },
        ]}
      />
      <FeedbackCard title="Nhận xét" text={pronunciation.feedback} />
      <FeedbackCard title="Phản hồi phát âm" text={pronunciationFeedback} />
    </View>
  );
}
