import { Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { FeedbackScoreCard } from "./feedback-score-card";
import { FeedbackCard } from "./feedback-card";
import { FeedbackListCard } from "./feedback-list-card";
import { FeedbackWarningBanner } from "./feedback-warning-banner";
import type {
  PronunciationResult,
  WeakPhoneme,
  WeakWord,
} from "@/features/speaking/api/speaking.types";

interface FeedbackPronunciationTabProps {
  pronunciation: PronunciationResult;
  pronunciationFeedback: string;
}

function WeakWordItem({ item }: { item: WeakWord }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View className="gap-1">
      <View className="flex-row flex-wrap items-center gap-2">
        <Text className="font-heading text-sm" style={{ color: theme.text.primary }}>
          {item.word}
        </Text>
        {item.errorTypeLabel ? (
          <View
            className="rounded-full px-2 py-0.5"
            style={{ backgroundColor: theme.warning.subtle }}
          >
            <Text
              className="font-heading text-[10px]"
              style={{ color: theme.warning.text }}
            >
              {item.errorTypeLabel}
            </Text>
          </View>
        ) : null}
      </View>
      <Text className="font-body text-xs" style={{ color: theme.text.secondary }}>
        Độ chính xác: {item.averageAccuracy}% · {item.occurrences} lần xuất hiện
      </Text>
    </View>
  );
}

function WeakPhonemeItem({ item }: { item: WeakPhoneme }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View className="gap-1">
      <View className="flex-row flex-wrap items-center gap-2">
        <Text
          className="font-heading text-sm"
          style={{ color: theme.brand.primary }}
        >
          /{item.ipa}/
        </Text>
        {item.label ? (
          <Text
            className="font-body text-xs"
            style={{ color: theme.text.secondary }}
          >
            {item.label}
          </Text>
        ) : null}
        {item.tier ? (
          <View
            className="rounded-full px-2 py-0.5"
            style={{ backgroundColor: theme.info.subtle }}
          >
            <Text
              className="font-heading text-[10px]"
              style={{ color: theme.info.text }}
            >
              {item.tier}
            </Text>
          </View>
        ) : null}
      </View>
      <Text className="font-body text-xs" style={{ color: theme.text.secondary }}>
        Điểm TB: {item.averageScore} · {item.occurrences} lần
      </Text>
      {item.drill ? (
        <Text
          className="font-body text-xs leading-5"
          style={{ color: theme.text.tertiary }}
        >
          Luyện tập: {item.drill}
        </Text>
      ) : null}
    </View>
  );
}

export function FeedbackPronunciationTab({
  pronunciation,
  pronunciationFeedback,
}: FeedbackPronunciationTabProps) {
  if (pronunciation.noAudio) {
    return (
      <View className="gap-4">
        <FeedbackWarningBanner
          variant="info"
          text="Phiên này không có dữ liệu audio để chấm phát âm."
        />
        {/* {pronunciationFeedback ? (
          <FeedbackCard title="Phản hồi phát âm" text={pronunciationFeedback} />
        ) : null} */}
      </View>
    );
  }

  const rows: { label: string; value: string | number }[] = [
    { label: "Độ chính xác trung bình", value: `${pronunciation.averageAccuracy}%` },
    { label: "Độ trôi chảy trung bình", value: `${pronunciation.averageFluency}%` },
    {
      label: "Độ hoàn chỉnh trung bình",
      value: `${pronunciation.averageCompleteness}%`,
    },
    { label: "Tổng số đánh giá", value: pronunciation.totalAssessed },
  ];
  if (pronunciation.cleanSession) {
    rows.push({ label: "Phiên sạch", value: "Không có lỗi đáng kể" });
  }

  return (
    <View className="gap-4">
      <FeedbackScoreCard title="Phát âm" score={pronunciation.score} rows={rows} />
      {pronunciation.weakWords && pronunciation.weakWords.length > 0 ? (
        <FeedbackListCard
          title="Từ phát âm yếu"
          items={pronunciation.weakWords}
          renderItem={(item) => <WeakWordItem item={item} />}
        />
      ) : null}
      {pronunciation.weakPhonemes && pronunciation.weakPhonemes.length > 0 ? (
        <FeedbackListCard
          title="Phoneme cần cải thiện"
          items={pronunciation.weakPhonemes}
          renderItem={(item) => <WeakPhonemeItem item={item} />}
        />
      ) : null}
      <FeedbackCard title="Nhận xét" text={pronunciation.feedback} />
      {/* <FeedbackCard title="Phản hồi phát âm" text={pronunciationFeedback} /> */}
    </View>
  );
}
