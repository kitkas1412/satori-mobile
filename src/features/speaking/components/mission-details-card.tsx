// Card hiển thị kết quả từng nhiệm vụ trên màn hình ConversationFeedbackScreen.
// Mỗi nhiệm vụ hiển thị icon trạng thái (hoàn thành/chưa hoàn thành), tên và lý do AI đánh giá.

import { CheckCircle, Circle } from "lucide-react-native";
import { Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import type { MissionDetails } from "@/features/speaking/api";

interface MissionDetailsCardProps {
  missionDetails: MissionDetails[];
}

export function MissionDetailsCard({
  missionDetails,
}: MissionDetailsCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  // Không render nếu session không có nhiệm vụ (ví dụ: free-talk session)
  if (!missionDetails?.length) return null;

  return (
    <View
      className="rounded-2xl p-4 gap-3"
      style={{ backgroundColor: theme.cardBackground }}
    >
      <Text
        className="font-heading text-base"
        style={{ color: theme.textDefault }}
      >
        Nhiệm vụ
      </Text>
      {missionDetails.map((mission, index) => (
        <View key={index} className="flex-row items-start gap-3">
          {mission.status === "COMPLETED" ? (
            <CheckCircle size={20} color={theme.success} />
          ) : (
            <Circle size={20} color={theme.textMuted} />
          )}
          <View className="flex-1">
            <Text
              className="font-body text-sm"
              style={{ color: theme.textDefault }}
            >
              {mission.title}
            </Text>
            {mission.titleJapanese ? (
              <Text
                className="font-body text-xs"
                style={{ color: theme.textMuted }}
              >
                {mission.titleJapanese}
              </Text>
            ) : null}
            {mission.reasoning ? (
              <Text
                className="font-body text-xs mt-1"
                style={{ color: theme.textMuted }}
              >
                {mission.reasoning}
              </Text>
            ) : null}
          </View>
          <Text
            className="font-body text-xs"
            style={{ color: theme.textMuted }}
          >
            {mission.progressPct}%
          </Text>
        </View>
      ))}
    </View>
  );
}
