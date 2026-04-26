import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Text, TouchableOpacity, View } from "react-native";

interface ProfileRowProps {
  label: string;
  value: string;
  onChangePress?: () => void;
}

export function ProfileRow({ label, value, onChangePress }: ProfileRowProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.background.surface,
        borderWidth: 1,
        borderColor: theme.border.subtle,
      }}
    >
      <View className="px-4 py-4 flex-row items-center justify-between">
        <View className="gap-1 flex-1 mr-4">
          <Text
            className="font-body"
            style={{ fontSize: 11, color: theme.text.secondary }}
          >
            {label}
          </Text>
          <Text
            className="font-body text-base"
            style={{ color: theme.text.primary }}
          >
            {value || "—"}
          </Text>
        </View>
        {onChangePress && (
          <TouchableOpacity activeOpacity={0.6} onPress={onChangePress} hitSlop={12}>
            <Text
              className="font-heading text-base"
              style={{ color: theme.brand.primary }}
            >
              Thay đổi
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
