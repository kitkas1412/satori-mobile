// Màn hình hiển thị phần thưởng sau khi hoàn thành session hội thoại.
// Hiển thị tuần tự theo queue: Streak → Level → từng Badge.
// Dữ liệu đọc từ Zustand store (đã được lưu bởi completeSession).

import { Check, Flame, Shield, Star } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { PrimaryButton, ProgressBar } from "@/components/ui";
import { useConversationStore } from "@/stores";
import type { BadgeEarned, LevelUp, StreakNotification } from "@/features/speaking/api";

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

function getWeekStreakDays(streakLastDate: string, currentStreak: number): boolean[] {
  const lastDate = new Date(streakLastDate + "T00:00:00");
  const streakStartDate = new Date(lastDate);
  streakStartDate.setDate(lastDate.getDate() - currentStreak + 1);

  // Monday of the week containing lastDate (week starts Monday)
  const dayOfWeek = lastDate.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekMonday = new Date(lastDate);
  weekMonday.setDate(lastDate.getDate() - daysToMonday);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekMonday);
    day.setDate(weekMonday.getDate() + i);
    return day >= streakStartDate && day <= lastDate;
  });
}

const WEEK_DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function StreakView({
  data,
  theme,
}: {
  data: StreakNotification;
  theme: typeof Colors.light;
}) {
  const weekDays = getWeekStreakDays(data.streak_last_date, data.current_streak);

  return (
    <View className="flex-1 items-center justify-center px-8 gap-6">
      <View
        className="items-center justify-center rounded-full"
        style={{
          width: 96,
          height: 96,
          backgroundColor: theme.warning.subtle,
        }}
      >
        <Flame size={48} color={theme.warning.default} />
      </View>

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
        {WEEK_DAY_LABELS.map((label, i) => (
          <View key={label} className="items-center gap-1">
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: 36,
                height: 36,
                backgroundColor: weekDays[i]
                  ? theme.warning.default
                  : theme.border.subtle,
              }}
            >
              {weekDays[i] && (
                <Check size={20} color="white" strokeWidth={2.5} />
              )}
            </View>
            <Text
              className="font-body text-xs"
              style={{ color: theme.text.secondary }}
            >
              {label}
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
    <View className="flex-1 items-center justify-center px-8 gap-4">
      <View
        className="items-center justify-center rounded-full"
        style={{
          width: 80,
          height: 80,
          backgroundColor: theme.success.subtle,
        }}
      >
        <Star size={40} color={theme.success.default} />
      </View>

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
          style={{ backgroundColor: theme.success.subtle }}
        >
          <Text
            className="font-heading text-lg"
            style={{ color: theme.success.bold }}
          >
            Level {data.newLevel}
          </Text>
        </View>
      </View>

      <Text
        className="font-heading text-3xl"
        style={{ color: theme.success.default }}
      >
        +{data.expEarned} EXP
      </Text>

      <View className="w-full gap-2">
        <ProgressBar progress={data.progressPercentage / 100} />
        <Text
          className="font-body text-xs text-center"
          style={{ color: theme.text.secondary }}
        >
          {Math.round(data.progressPercentage)}% tới Level {data.newLevel + 1}
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
        <View
          className="items-center justify-center rounded-full"
          style={{
            width: 96,
            height: 96,
            backgroundColor: theme.purple.subtle,
          }}
        >
          <Shield size={48} color={theme.purple.default} />
        </View>
      )}

      <Text
        className="font-heading text-2xl text-center"
        style={{ color: theme.text.primary }}
      >
        Huy hiệu mới!
      </Text>

      <Text
        className="font-heading text-xl text-center"
        style={{ color: theme.text.primary }}
      >
        {data.badgeName}
      </Text>

      <Text
        className="font-body text-sm text-center"
        style={{ color: theme.text.secondary, lineHeight: 20 }}
      >
        {data.description}
      </Text>

      <View
        className="rounded-full px-4 py-2"
        style={{ backgroundColor: theme.success.subtle }}
      >
        <Text
          className="font-body text-sm font-semibold"
          style={{ color: theme.success.bold }}
        >
          +{data.expReward} EXP
        </Text>
      </View>
    </View>
  );
}

export function ConversationRewardScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const feedback = useConversationStore((s) => s.feedback);
  const clearSession = useConversationStore((s) => s.clearSession);

  const [queue, setQueue] = useState<RewardItem[]>(() => {
    if (!feedback) return [];
    return buildQueue(
      feedback.streakNotification,
      feedback.levelUp,
      feedback.newBadgesEarned,
    );
  });

  const current = queue[0] ?? null;

  // Nếu không có phần thưởng nào, redirect về speaking tab ngay
  useEffect(() => {
    if (queue.length === 0) {
      clearSession();
      router.replace("/(tabs)/speaking");
    }
  }, []);

  function handleNext() {
    const next = queue.slice(1);
    if (next.length === 0) {
      clearSession();
      router.replace("/(tabs)/speaking");
    } else {
      setQueue(next);
    }
  }

  const buttonLabel =
    current?.type === "badge" ? "Nhận huy hiệu" :
    current?.type === "level" ? "Tuyệt vời!" :
    "Tiếp tục";

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
          text={buttonLabel}
          variant="dark"
          onPress={handleNext}
        />
      </View>
    </View>
  );
}
