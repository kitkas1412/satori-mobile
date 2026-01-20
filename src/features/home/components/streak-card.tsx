import { Check, Flame } from "lucide-react-native";
import { Text, View } from "react-native";

export function StreakCard() {
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

  const weekDays = [
    { label: "T2", active: true },
    { label: "T3", active: true },
    { label: "T4", active: true },
    { label: "T5", active: true },
    { label: "T6", active: false },
    { label: "T7", active: false },
    { label: "CN", active: false },
  ];

  return (
    <View className="mx-4 mb-6 bg-background-surface rounded-2xl border border-border overflow-hidden">
      <View className="flex-row items-center justify-between px-2 py-5">
        <Text className="text-text-muted text-lg font-bold font-heading">
          {getCurrentDateString()}
        </Text>
        <View className="flex-row items-center gap-1">
          <Flame size={20} color="#F97316" />
          <Text className="text-[#F97316] text-base font-bold font-heading">
            4
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-around px-2 pb-4">
        {weekDays.map((day, index) => (
          <View key={index} className="items-center gap-1">
            <View
              className={`w-9 h-9 rounded-full items-center justify-center ${
                day.active ? "bg-primary-default" : "bg-[rgba(123,146,239,0.2)]"
              }`}
            >
              {day.active && <Check className="w-5 h-5" color={"#FFFFFF"} />}
            </View>
            <Text
              className={`text-xs font-bold ${
                day.active ? "text-primary-default" : "text-text-muted"
              } font-heading`}
            >
              {day.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
