import { CircleCheck, MessageSquareMore, Mic } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type LessonStatus = "completed" | "active" | "locked";
type LessonType = "pronunciation" | "stress" | "conversation";

interface LessonCardProps {
  title: string;
  subtitle: string;
  type: LessonType;
  status: LessonStatus;
  accentColor?: string;
  onPress?: () => void;
}

export function LessonCard({
  title,
  subtitle,
  type,
  status,
  accentColor = "#7b92ef", // primary-default
  onPress,
}: LessonCardProps) {
  const getIcon = () => {
    switch (type) {
      case "pronunciation":
        return CircleCheck;
      case "stress":
        return Mic;
      case "conversation":
        return MessageSquareMore;
    }
  };

  const Icon = getIcon();

  // Completed lessons always use green checkmark
  const iconColor = status === "completed" ? "#10B981" : accentColor;

  const borderClass =
    status === "active"
      ? "border-[#7b92ef]"
      : status === "locked"
        ? "border-border"
        : "border-transparent";

  return (
    <Pressable
      onPress={onPress}
      className={`bg-background-surface rounded-[14px] border ${borderClass} p-4 pt-6 pb-4 flex-row gap-4 h-[97px]`}
      disabled={status === "locked"}
    >
      <View className="w-6 h-6">
        <Icon size={24} color={iconColor} strokeWidth={2} />
      </View>
      <View className="flex-1 gap-[5px]">
        <Text className="text-text-muted text-lg font-bold font-heading">
          {title}
        </Text>
        <Text className="text-text-muted text-xs font-body">{subtitle}</Text>
      </View>
    </Pressable>
  );
}
