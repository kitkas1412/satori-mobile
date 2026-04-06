import type { Content } from "@/features/notification/api";
import { Colors } from "@/constants/theme";
import { Text, View } from "react-native";

type Props = {
  item: Content;
  theme: (typeof Colors)[keyof typeof Colors];
};

export function NotificationItem({ item, theme }: Props) {
  return (
    <View
      className="px-4 py-3"
      style={{ borderBottomWidth: 1, borderBottomColor: theme.border.subtle }}
    >
      <Text
        className={`text-sm mb-0.5 ${item.read ? "font-body" : "font-heading"}`}
        style={{ color: theme.text.primary }}
      >
        {item.title}
      </Text>
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
    </View>
  );
}
