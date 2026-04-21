import { Award, Check, Flame, Star } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { PrimaryButton, ProgressBar, RewardIconCircle } from "@/components/ui";
import { usePracticeSessionSummary } from "../hooks";
import type { BadgeEarned, LevelUp, StreakNotification } from "../api";
import { useStreakHistory } from "@/features/streak/hooks";

type RewardItem =
  | { type: "streak"; data: StreakNotification }
  | { type: "level"; data: LevelUp }
  | { type: "badge"; data: BadgeEarned };

function buildQueue(
  streakNotification: StreakNotification | null,
  levelUp: LevelUp | null,
  newBadgesEarned: BadgeEarned[],
): RewardItem[] {
  const queue: RewardItem[] = [];
  if (streakNotification?.is_first_activity_today)
    queue.push({ type: "streak", data: streakNotification });
  if (levelUp)
    queue.push({ type: "level", data: levelUp });
  for (const badge of newBadgesEarned)
    queue.push({ type: "badge", data: badge });
  return queue;
}

const dayOfWeekLabel: Record<string, string> = {
  MON: "T2",
  TUE: "T3",
  WED: "T4",
  THU: "T5",
  FRI: "T6",
  SAT: "T7",
  SUN: "CN",
};

function StreakView({
  data,
  theme,
}: {
  data: StreakNotification;
  theme: typeof Colors.light;
}) {
  const { data: history } = useStreakHistory(7);
  const weekDays = history?.daily_records
    ? [...history.daily_records].reverse().map((record) => ({
        label: dayOfWeekLabel[record.day_of_week] ?? record.day_of_week,
        active: record.had_activity,
      }))
    : Array.from({ length: 7 }, (_, i) => ({
        label: Object.values(dayOfWeekLabel)[i] ?? "",
        active: false,
      }));

  return (
    <View className="flex-1 items-center justify-center px-8 gap-6">
      <RewardIconCircle backgroundColor={theme.warning.subtle}>
        <Flame size={48} color={theme.warning.default} />
      </RewardIconCircle>

      <View className="items-center gap-3">
        <Text
          className="font-heading text-2xl text-center"
          style={{ color: theme.text.primary }}
        >
          Chuỗi {data.current_streak} ngày!
        </Text>

        <Text
          className="font-body text-sm text-center"
          style={{ color: theme.text.secondary, lineHeight: 20 }}
        >
          Hôm nay bạn đã xuất hiện. Quay lại vào ngày mai để tiếp tục tích luỹ.
        </Text>
      </View>

      <View className="flex-row justify-between w-full">
        {weekDays.map((day, i) => (
          <View key={i} className="items-center gap-1">
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: 36,
                height: 36,
                backgroundColor: day.active
                  ? theme.warning.default
                  : theme.border.subtle,
              }}
            >
              {day.active && (
                <Check size={20} color="white" strokeWidth={2.5} />
              )}
            </View>
            <Text
              className="font-body text-xs"
              style={{ color: theme.text.secondary }}
            >
              {day.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function LevelUpView({
  data,
  theme,
}: {
  data: LevelUp;
  theme: typeof Colors.light;
}) {
  return (
    <View className="flex-1 items-center justify-center px-8 gap-6">
      <RewardIconCircle backgroundColor={theme.brand.primarySubtle}>
        <Star size={48} color={theme.brand.primary} />
      </RewardIconCircle>

      {data.isLevelUp ? (
        <View className="items-center gap-4">
          <Text
            className="font-heading text-2xl text-center"
            style={{ color: theme.text.primary }}
          >
            Lên cấp!
          </Text>

          <View className="flex-row items-center gap-3">
            <View
              className="rounded-full px-4 py-2"
              style={{ backgroundColor: theme.border.subtle }}
            >
              <Text
                className="font-heading text-lg"
                style={{ color: theme.text.secondary }}
              >
                Level {data.previousLevel}
              </Text>
            </View>

            <Text
              className="font-heading text-xl"
              style={{ color: theme.text.secondary }}
            >
              →
            </Text>

            <View
              className="rounded-full px-4 py-2"
              style={{ backgroundColor: theme.brand.primary }}
            >
              <Text
                className="font-heading text-lg"
                style={{ color: theme.brand.onPrimary }}
              >
                Level {data.newLevel}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View className="items-center gap-3">
          <View
            className="rounded-full px-4 py-2"
            style={{ backgroundColor: theme.brand.primary }}
          >
            <Text
              className="font-heading text-lg"
              style={{ color: theme.brand.onPrimary }}
            >
              Level {data.newLevel}
            </Text>
          </View>

          <Text
            className="font-body text-sm text-center"
            style={{ color: theme.text.secondary, lineHeight: 20 }}
          >
            Tiến trình của bạn đã tăng lên. Tiếp tục luyện tập để nhận thêm nhiều EXP
          </Text>
        </View>
      )}

      <Text
        className="font-heading text-3xl"
        style={{ color: theme.brand.primary }}
      >
        +{data.expEarned} EXP
      </Text>

      <View className="w-full gap-2">
        <ProgressBar progress={data.progressPercentage / 100} />
        <Text
          className="font-body text-xs text-center"
          style={{ color: theme.text.secondary }}
        >
          Cần {Math.round(100 - data.progressPercentage)}% để lên Level {data.newLevel + 1}
        </Text>
      </View>
    </View>
  );
}

function BadgeView({
  data,
  theme,
}: {
  data: BadgeEarned;
  theme: typeof Colors.light;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <View className="flex-1 items-center justify-center px-8 gap-4">
      {!imageError && data.iconUrl ? (
        <Image
          source={{ uri: data.iconUrl }}
          style={{ width: 96, height: 96, borderRadius: 48 }}
          onError={() => setImageError(true)}
        />
      ) : (
        <RewardIconCircle backgroundColor={theme.purple.subtle}>
          <Award size={48} color={theme.purple.default} />
        </RewardIconCircle>
      )}

      <View className="items-center gap-2">
        <Text
          className="font-body text-sm text-center"
          style={{ color: theme.text.secondary }}
        >
          Huy hiệu mới nhận được
        </Text>

        <Text
          className="font-heading text-2xl text-center"
          style={{ color: theme.purple.default }}
        >
          {data.badgeName}
        </Text>
      </View>

      <Text
        className="font-body text-sm text-center"
        style={{ color: theme.text.secondary, lineHeight: 20 }}
      >
        {data.description}
      </Text>
    </View>
  );
}

export function PracticeRewardScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const { practiceSessionId, sessionType, lessonId } = useLocalSearchParams<{
    practiceSessionId?: string;
    sessionType?: string;
    lessonId?: string;
  }>();

  const { data: summary } = usePracticeSessionSummary(practiceSessionId);

  const [queue, setQueue] = useState<RewardItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!summary) return;
    const q = buildQueue(
      summary.streakNotification,
      summary.levelUp,
      summary.newBadgesEarned ?? [],
    );
    setQueue(q);
    setInitialized(true);
  }, [summary]);

  function handleGoSessionConfig() {
    if (lessonId && sessionType) {
      router.replace({ pathname: "/session-config", params: { lessonId, sessionType } });
    } else {
      router.replace({ pathname: "/(tabs)/practice", params: { tab: "ai" } });
    }
  }

  // Redirect nếu không có reward sau khi data đã load
  useEffect(() => {
    if (initialized && queue.length === 0) {
      handleGoSessionConfig();
    }
  }, [initialized, queue.length]);

  function handleNext() {
    const next = queue.slice(1);
    if (next.length === 0) {
      handleGoSessionConfig();
    } else {
      setQueue(next);
    }
  }

  const current = queue[0] ?? null;

  if (!current) return null;

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: theme.background.page,
        paddingTop: insets.top,
      }}
    >
      {current.type === "streak" && (
        <StreakView data={current.data} theme={theme} />
      )}
      {current.type === "level" && (
        <LevelUpView data={current.data} theme={theme} />
      )}
      {current.type === "badge" && (
        <BadgeView data={current.data} theme={theme} />
      )}

      <View
        className="px-4"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <PrimaryButton
          text="Tiếp tục"
          variant="dark"
          onPress={handleNext}
        />
      </View>
    </View>
  );
}
