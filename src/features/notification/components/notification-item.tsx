import type { Content } from "@/features/notification/api";
import { Colors } from "@/constants/theme";
import { Pressable, Text, View } from "react-native";

type Props = {
  item: Content;
  theme: (typeof Colors)[keyof typeof Colors];
  onPress: () => void;
};

export function NotificationItem({ item, theme, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-3"
      style={{
        borderBottomWidth: 1,
        borderBottomColor: theme.border.subtle,
        backgroundColor: item.isRead
          ? "transparent"
          : `${theme.brand.primary}14`,
      }}
    >
      <View className="flex-row items-center justify-between mb-0.5">
        <Text
          className={`text-sm flex-1 mr-2 ${item.isRead ? "font-body" : "font-heading"}`}
          style={{ color: theme.text.primary }}
        >
          {item.title}
        </Text>
        {!item.isRead && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.brand.primary,
            }}
          />
        )}
      </View>
      <Text className="text-sm font-body" style={{ color: theme.text.secondary }}>
        {item.body}
      </Text>
      <Text className="text-xs font-body mt-1" style={{ color: theme.text.muted }}>
        {new Date(item.createdAt).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </Pressable>
  );
}
