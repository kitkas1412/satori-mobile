// Component hiển thị một nhiệm vụ trong màn hình TopicDetailScreen.
// Hiển thị số thứ tự, tên nhiệm vụ và icon trạng thái (hoàn thành/chưa hoàn thành).

import { Check } from "lucide-react-native";
import { Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import type { Missions } from "@/features/speaking/api";

interface MissionItemProps {
  mission: Missions;
  /** Vị trí trong danh sách (0-based), dùng để hiển thị số thứ tự */
  index: number;
}

export function MissionItem({ mission, index }: MissionItemProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  /** Icon checkmark màu xanh khi hoàn thành, xám khi chưa */
  const isCompleted = mission.status === "COMPLETED";

  return (
    <View className="flex-row items-center justify-between py-3">
      <View className="flex-row items-center gap-4 flex-1">
        <Text
          className="font-heading text-[32px] w-7 text-center"
          style={{ color: theme.textMuted, lineHeight: 40 }}
        >
          {index + 1}
        </Text>
        <Text
          className="font-body text-base flex-1"
          style={{ color: theme.textMuted }}
        >
          {mission.titleVi}
        </Text>
      </View>

      <View
        className="items-center justify-center rounded-full ml-3"
        style={{
          width: 40,
          height: 40,
          backgroundColor: isCompleted ? theme.success : theme.border,
        }}
      >
        <Check size={22} color="white" strokeWidth={2.5} />
      </View>
    </View>
  );
}
