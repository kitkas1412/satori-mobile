import { Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

interface FeedbackListCardProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyText?: string;
  maxItems?: number;
}

export function FeedbackListCard<T>({
  title,
  items,
  renderItem,
  emptyText,
  maxItems = 5,
}: FeedbackListCardProps<T>) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const visible = items.slice(0, maxItems);
  const remaining = items.length - visible.length;

  return (
    <View
      className="rounded-xl p-4 gap-3 border"
      style={{
        backgroundColor: theme.background.surface,
        borderColor: theme.border.subtle,
      }}
    >
      <Text className="font-heading text-sm" style={{ color: theme.text.primary }}>
        {title}
      </Text>

      {items.length === 0 && emptyText ? (
        <Text
          className="font-body text-xs"
          style={{ color: theme.text.tertiary }}
        >
          {emptyText}
        </Text>
      ) : (
        <View className="gap-3">
          {visible.map((item, index) => (
            <View
              key={index}
              style={
                index < visible.length - 1
                  ? {
                      borderBottomWidth: 0.5,
                      borderBottomColor: theme.border.subtle,
                      paddingBottom: 12,
                    }
                  : undefined
              }
            >
              {renderItem(item, index)}
            </View>
          ))}
          {remaining > 0 && (
            <Text
              className="font-body text-xs"
              style={{ color: theme.text.tertiary }}
            >
              +{remaining} mục khác
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
