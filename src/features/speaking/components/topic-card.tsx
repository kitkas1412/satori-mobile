import { MessageSquareMore } from "lucide-react-native";
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
  onPress?: () => void;
}

export function TopicCard({
  title,
  subtitle,
  type,
  status,
  onPress,
}: TopicCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Pressable
      onPress={onPress}
      className="rounded-[14px] border p-4 pt-6 pb-4 flex-row gap-4 h-[97px]"
      style={{ backgroundColor: theme.background, borderColor: theme.border }}
      disabled={status === "locked"}
    >
      <View className="w-6 h-6">
        <MessageSquareMore size={24} color={theme.primary} strokeWidth={2} />
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
