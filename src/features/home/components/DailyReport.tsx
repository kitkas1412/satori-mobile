import { CircleCheck, Clock } from "lucide-react-native";
import { Text, View } from "react-native";

export function DailyReport() {
  return (
    <View className="mx-4 mb-6">
      <View className="mb-3">
        <Text
          className="text-text-muted text-xl font-bold"
          style={{ fontFamily: "Nunito_700Bold" }}
        >
          Báo cáo học tập
        </Text>
        <Text className="text-text-muted text-xs font-body">
          Cày cuốc sương sương, tương lai phi thường
        </Text>
      </View>

      <View className="flex-row gap-4">
        <View className="flex-1 bg-background-surface rounded-2xl border border-border p-4">
          <View className="flex-row items-center gap-1.5 mb-2">
            <Clock className="w-5 h-5" color={"#7B92EF"} />
            <Text className="text-text-muted text-sm font-body">
              Thời gian học
            </Text>
          </View>
          <Text className="text-text-muted text-lg font-bold font-heading">
            45 phút
          </Text>
        </View>

        <View className="flex-1 bg-background-surface rounded-2xl border border-border p-4">
          <View className="flex-row items-center gap-1.5 mb-2">
            <CircleCheck className="w-5 h-5" color={"#10B981"} />
            <Text className="text-text-muted text-sm font-body">
              Bài đã học
            </Text>
          </View>
          <Text className="text-text-muted text-lg font-bold font-heading">
            12 bài
          </Text>
        </View>
      </View>
    </View>
  );
}
