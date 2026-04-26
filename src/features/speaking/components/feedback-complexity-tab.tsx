import { View } from "react-native";
import { FeedbackScoreCard } from "./feedback-score-card";
import { FeedbackCard } from "./feedback-card";
import type { ComplexityResult } from "@/features/speaking/api/speaking.types";

interface FeedbackComplexityTabProps {
  complexity: ComplexityResult;
  complexityFeedback: string;
}

export function FeedbackComplexityTab({
  complexity,
  complexityFeedback,
}: FeedbackComplexityTabProps) {
  const jlptEntries = Object.entries(complexity.jlptDistribution ?? {});
  const jlptDisplay =
    jlptEntries.length > 0
      ? jlptEntries.map(([level, count]) => `${level}: ${count}`).join(", ")
      : "Chưa có dữ liệu";

  return (
    <View className="gap-4">
      <FeedbackScoreCard
        title="Phức tạp"
        score={complexity.score}
        rows={[
          { label: "Số từ vựng duy nhất", value: complexity.uniqueVocabularyCount },
          { label: "Phân bố JLPT", value: jlptDisplay },
        ]}
      />
      <FeedbackCard title="Nhận xét" text={complexity.feedback} />
      <FeedbackCard title="Phản hồi từ vựng" text={complexityFeedback} />
    </View>
  );
}
