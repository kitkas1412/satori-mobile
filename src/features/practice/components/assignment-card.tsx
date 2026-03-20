import { Circle, CircleCheck, Clock } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

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

  const statusColor: Record<AssignmentStatus, string> = {
    in_progress: theme.primary,
    not_started: theme.warning,
    completed: theme.success,
    overdue: theme.error,
    graded: theme.success,
    submitted: theme.primary,
  };

  return (
    <Pressable
      onPress={onPress}
      className="bg-background-surface rounded-2xl p-4 gap-3"
      style={{ borderWidth: 0.6, borderColor: theme.border }}
    >
      {/* Title + icon */}
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text
            className="font-heading text-base"
            style={{ color: theme.textMuted }}
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text
            className="font-body text-xs"
            style={{ color: theme.textMuted, opacity: 0.7 }}
          >
            {subtitle}
          </Text>
        </View>
        {status === "completed" || status === "graded" || status === "submitted" ? (
          <CircleCheck
            size={20}
            color={statusColor[status]}
            strokeWidth={2}
          />
        ) : (
          <Circle size={20} color={theme.border} strokeWidth={1.5} />
        )}
      </View>

      {/* Due date + status */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1">
          <Clock size={16} color={theme.textMuted} strokeWidth={1.5} />
          <Text
            className="font-body text-xs"
            style={{ color: theme.textMuted, opacity: 0.7 }}
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
