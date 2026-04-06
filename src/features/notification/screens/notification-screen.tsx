import { IconButton, ScreenHeader } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function NotificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
      <ScreenHeader
        title="Thông báo"
        paddingTop={insets.top + 16}
        leftAction={
          <IconButton
            icon={<ArrowLeft size={24} color={theme.icon.primary} />}
            onPress={() => router.back()}
          />
        }
      />

      <View className="flex-1 items-center justify-center px-8">
        <Text
          className="text-base font-body text-center"
          style={{ color: theme.text.secondary }}
        >
          Chưa có thông báo nào
        </Text>
      </View>
    </View>
  );
}
