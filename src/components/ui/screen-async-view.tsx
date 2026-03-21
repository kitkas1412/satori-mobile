import { ActivityIndicator, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface ScreenAsyncViewProps {
  isLoading: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  errorText?: string;
  emptyText?: string;
  children: React.ReactNode;
}

export function ScreenAsyncView({
  isLoading,
  isError = false,
  isEmpty = false,
  errorText = "Không thể tải dữ liệu. Vui lòng thử lại.",
  emptyText = "Chưa có dữ liệu.",
  children,
}: ScreenAsyncViewProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Text
          className="font-body text-sm text-center"
          style={{ color: theme.textMuted }}
        >
          {errorText}
        </Text>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Text
          className="font-body text-sm text-center"
          style={{ color: theme.textMuted }}
        >
          {emptyText}
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}
