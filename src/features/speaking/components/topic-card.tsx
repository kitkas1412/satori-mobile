import { CircleCheck, MessageSquareMore } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

type LessonStatus = "completed" | "active" | "locked";
type LessonType = "pronunciation" | "stress" | "conversation";

interface TopicCardProps {
  title: string;
  subtitle: string;
  type: LessonType;
  status: LessonStatus;
  practiced?: boolean;
  showBorder?: boolean;
  accentColor?: string;
  onPress?: () => void;
}

export function TopicCard({
  title,
  subtitle,
  type,
  status,
  practiced,
  showBorder,
  accentColor,
  onPress,
}: TopicCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const iconColor = accentColor ?? theme.primary;

  return (
    <Pressable
      onPress={onPress}
      className="p-4 pt-6 pb-4 flex-row gap-4 h-[97px]"
      style={{
        backgroundColor: showBorder
          ? colorScheme === "dark"
            ? "hsl(220, 20%, 14%)"
            : "hsl(220, 20%, 93%)"
          : theme.background,
        ...(showBorder && {
          borderWidth: 2,
          borderColor: theme.border,
          borderRadius: 8,
        }),
      }}
      disabled={status === "locked"}
    >
      <View className="w-6 h-6">
        {practiced ? (
          <CircleCheck size={24} color={theme.success} strokeWidth={2} />
        ) : (
          <MessageSquareMore size={24} color={iconColor} strokeWidth={2} />
        )}
      </View>
      <View className="flex-1 gap-[5px]">
        <Text
          className="text-lg font-bold font-heading"
          style={{ color: theme.textDefault }}
        >
          {title}
        </Text>
        <Text className="text-xs font-body" style={{ color: theme.textMuted }}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}
