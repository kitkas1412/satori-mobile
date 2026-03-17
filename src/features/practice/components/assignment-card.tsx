import { Circle, CircleCheck, Clock } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type AssignmentStatus = "in_progress" | "not_started" | "completed" | "overdue";

export interface AssignmentCardProps {
  title: string;
  subtitle: string;
  dueDate: string;
  status: AssignmentStatus;
  progress?: { current: number; total: number };
  onPress?: () => void;
}

const STATUS_LABEL: Record<AssignmentStatus, string> = {
  in_progress: "Đang làm",
  not_started: "Chưa làm",
  completed: "Hoàn thành",
  overdue: "Quá hạn",
};

const STATUS_COLOR: Record<AssignmentStatus, string> = {
  in_progress: "#155dfc",
  not_started: "#f54900",
  completed: "#00a63e",
  overdue: "#9ca3af",
};

export function AssignmentCard({
  title,
  subtitle,
  dueDate,
  status,
  progress,
  onPress,
}: AssignmentCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const progressPct =
    progress && progress.total > 0
      ? progress.current / progress.total
      : 0;

  return (
    <Pressable
      onPress={onPress}
      className="bg-background-surface rounded-2xl p-4 gap-3"
      style={{ borderWidth: 0.6, borderColor: "rgba(0,0,0,0.1)" }}
    >
      {/* Title + icon */}
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text
            className="font-heading text-base"
            style={{ color: theme.textMuted }}
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
        {status === "completed" ? (
          <CircleCheck size={20} color={STATUS_COLOR.completed} strokeWidth={2} />
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
          style={{ color: STATUS_COLOR[status] }}
        >
          {STATUS_LABEL[status]}
        </Text>
      </View>

      {/* Progress bar (in_progress only) */}
      {status === "in_progress" && progress && (
        <View className="gap-1">
          <View className="flex-row items-center justify-between">
            <Text
              className="font-body text-tiny-xs"
              style={{ color: theme.textMuted, opacity: 0.7 }}
            >
              Tiến độ
            </Text>
            <Text
              className="font-heading text-tiny-xs"
              style={{ color: theme.textMuted }}
            >
              {progress.current}/{progress.total}
            </Text>
          </View>
          <View
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: "#e5e7eb" }}
          >
            <View
              className="h-full rounded-full"
              style={{
                backgroundColor: "#2b7fff",
                width: `${progressPct * 100}%`,
              }}
            />
          </View>
        </View>
      )}
    </Pressable>
  );
}
