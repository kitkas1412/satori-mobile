// Card hiển thị thông tin tóm tắt của một bài tập trong danh sách.
// Màu sắc và icon thay đổi theo trạng thái bài tập.

import { Circle, CircleCheck, Clock } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Các trạng thái bài tập có thể hiển thị trên card
export type AssignmentStatus =
  | "in_progress"
  | "not_started"
  | "completed"
  | "overdue"
  | "graded"
  | "submitted";

export interface AssignmentCardProps {
  title: string;
  subtitle: string;
  dueDate: string;
  status: AssignmentStatus;
  onPress?: () => void;
}

// Nhãn hiển thị tiếng Việt tương ứng với từng trạng thái
const STATUS_LABEL: Record<AssignmentStatus, string> = {
  in_progress: "Đang làm",
  not_started: "Chưa làm",
  completed: "Hoàn thành",
  overdue: "Quá hạn",
  graded: "Đã chấm điểm",
  submitted: "Đã nộp",
};

export function AssignmentCard({
  title,
  subtitle,
  dueDate,
  status,
  onPress,
}: AssignmentCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  // Màu badge trạng thái: xanh lá = hoàn thành/chấm, vàng = chưa làm, đỏ = quá hạn, v.v.
  const statusColor: Record<AssignmentStatus, string> = {
    in_progress: theme.info.default,
    not_started: theme.warning.default,
    completed: theme.success.default,
    overdue: theme.error.default,
    graded: theme.success.default,
    submitted: theme.info.default,
  };

  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl p-4 gap-3"
      style={{
        backgroundColor: theme.background.surface,
        borderWidth: 1,
        borderColor: theme.border.subtle,
      }}
    >
      {/* Tiêu đề + icon trạng thái */}
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text
            className="font-heading text-lg"
            style={{ color: theme.text.primary }}
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text
            className="font-body text-sm"
            style={{ color: theme.text.secondary }}
          >
            {subtitle}
          </Text>
        </View>
        {/* Hiển thị CircleCheck (có tick) khi bài đã hoàn thành/chấm/nộp, Circle trống khi chưa */}
        {status === "completed" ||
        status === "graded" ||
        status === "submitted" ? (
          <CircleCheck size={20} color={statusColor[status]} strokeWidth={2} />
        ) : (
          <Circle size={20} color={theme.icon.disabled} strokeWidth={1.5} />
        )}
      </View>

      {/* Hạn nộp + nhãn trạng thái */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1">
          <Clock size={16} color={theme.icon.secondary} strokeWidth={1.5} />
          <Text
            className="font-body text-xs"
            style={{ color: theme.text.secondary }}
          >
            Hạn: {dueDate}
          </Text>
        </View>
        <Text
          className="font-heading text-xs"
          style={{ color: statusColor[status] }}
        >
          {STATUS_LABEL[status]}
        </Text>
      </View>
    </Pressable>
  );
}
