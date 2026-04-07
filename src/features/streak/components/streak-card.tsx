import { Colors, Primitive } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Check, Flame } from "lucide-react-native";
import { Text, View } from "react-native";

import { useStreakCurrent, useStreakHistory } from "../hooks";

export function StreakCard() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const orangeColor = colorScheme === "dark" ? Primitive.amber[200] : Primitive.amber[400];

  const { data: current } = useStreakCurrent();
  const { data: history } = useStreakHistory(7);

  const getCurrentDateString = () => {
    const date = new Date();
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;

    const vietnameseDays = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];

    return `${vietnameseDays[dayOfWeek]}, ${dayOfMonth} tháng ${month}`;
  };

  const weekDayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const weekDays = history?.daily_records
    ? [...history.daily_records]
        .reverse()
        .map((record, index) => ({
          label: weekDayLabels[index] ?? "",
          active: record.had_activity,
        }))
    : weekDayLabels.map((label) => ({ label, active: false }));

  return (
    <View
      className="mx-4 mb-6 rounded-2xl border overflow-hidden"
      style={{ backgroundColor: theme.background.surface, borderColor: theme.border.subtle }}
    >
      <View className="flex-row items-center justify-between px-2 py-5">
        <Text className="text-lg font-bold font-heading" style={{ color: theme.text.primary }}>
          {getCurrentDateString()}
        </Text>
        <View className="flex-row items-center gap-1">
          <Flame size={20} color={orangeColor} />
          <Text className="text-base font-bold font-heading" style={{ color: orangeColor }}>
            {current?.current_streak ?? 0}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-around px-2 pb-4">
        {weekDays.map((day, index) => (
          <View key={index} className="items-center gap-1">
            <View
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{
                backgroundColor: day.active ? theme.brand.primary : theme.brand.primarySubtle,
              }}
            >
              {day.active && <Check className="w-5 h-5" color={Primitive.neutral[0]} />}
            </View>
            <Text
              className="text-xs font-bold font-heading"
              style={{ color: day.active ? theme.brand.primary : theme.text.secondary }}
            >
              {day.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
