import { CircleCheck, MessageSquareMore } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import type { PracticeStatus } from "@/features/speaking/api/speaking.types";

type ConversationStatus = "completed" | "active" | "locked";

interface ConversationCardProps {
  title: string;
  subtitle: string;
  status: ConversationStatus;
  practiceStatus: PracticeStatus;
  showBorder?: boolean;
  accentColor?: string;
  onPress?: () => void;
}

export function ConversationCard({
  title,
  subtitle,
  status,
  practiceStatus,
  showBorder,
  accentColor,
  onPress,
}: ConversationCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const iconColor = accentColor ?? theme.brand.primary;

  return (
    <Pressable
      onPress={onPress}
      className="p-4 pt-6 pb-4 flex-row gap-4 h-[97px]"
      style={{
        backgroundColor: showBorder
          ? theme.border.subtle
          : theme.background.page,
        ...(showBorder && {
          borderWidth: 2,
          borderColor: theme.border.default,
          borderRadius: 8,
        }),
      }}
      disabled={status === "locked"}
    >
      <View className="w-6 h-6">
        {practiceStatus === "COMPLETED" ? (
          <CircleCheck
            size={24}
            color={theme.success.default}
            strokeWidth={2}
          />
        ) : practiceStatus === "NOT_STARTED" ? (
          <MessageSquareMore size={24} color={iconColor} strokeWidth={2} />
        ) : (
          <MessageSquareMore size={24} color={iconColor} strokeWidth={2} />
        )}
      </View>
      <View className="flex-1 gap-[5px]">
        <Text
          className="text-lg font-bold font-heading"
          style={{ color: theme.text.primary }}
        >
          {title}
        </Text>
        <Text
          className="text-xs font-body"
          style={{ color: theme.text.secondary }}
        >
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}
