import { View } from "react-native";
import { FeedbackScoreCard } from "./feedback-score-card";
import { FeedbackCard } from "./feedback-card";
import { FeedbackWarningBanner } from "./feedback-warning-banner";
import type { ComplexityResult } from "@/features/speaking/api/speaking.types";

interface FeedbackComplexityTabProps {
  complexity: ComplexityResult;
  complexityFeedback: string;
}

function formatRecord(record: Record<string, number>): string {
  const entries = Object.entries(record);
  if (entries.length === 0) return "Chưa có dữ liệu";
  return entries.map(([key, value]) => `${key}: ${value}`).join(", ");
}

export function FeedbackComplexityTab({
  complexity,
  complexityFeedback,
}: FeedbackComplexityTabProps) {
  if (complexity.insufficient) {
    return (
      <View className="gap-4">
        <FeedbackWarningBanner
          variant="warning"
          text="Dữ liệu chưa đủ để đánh giá độ phức tạp ngôn ngữ. Hãy luyện tập thêm để có đánh giá đầy đủ."
        />
        {complexity.feedback ? (
          <FeedbackCard title="Nhận xét" text={complexity.feedback} />
        ) : null}
        {/* {complexityFeedback ? (
          <FeedbackCard title="Phản hồi từ vựng" text={complexityFeedback} />
        ) : null} */}
      </View>
    );
  }

  const jlptDisplay = formatRecord(complexity.jlptDistribution ?? {});

  const rows: { label: string; value: string | number }[] = [
    { label: "Số từ vựng duy nhất", value: complexity.uniqueVocabularyCount },
    { label: "Phân bố JLPT", value: jlptDisplay },
  ];
  if (complexity.lexical) {
    rows.push({ label: "Điểm từ vựng", value: complexity.lexical.score });
  }
  if (complexity.syntactic) {
    rows.push({ label: "Điểm cú pháp", value: complexity.syntactic.score });
  }

  return (
    <View className="gap-4">
      {complexity.partialMeasurement ? (
        <FeedbackWarningBanner
          variant="info"
          text="Kết quả đo lường chưa đầy đủ. Một số chỉ số có thể không phản ánh chính xác."
        />
      ) : null}
      <FeedbackScoreCard title="Phức tạp" score={complexity.score} rows={rows} />
      <FeedbackCard title="Nhận xét" text={complexity.feedback} />
      {/* <FeedbackCard title="Phản hồi từ vựng" text={complexityFeedback} /> */}
    </View>
  );
}
