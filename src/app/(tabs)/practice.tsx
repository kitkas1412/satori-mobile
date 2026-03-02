import { useAuthStore } from "@/stores/auth-store";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function PracticeScreen() {
  const user = useAuthStore((state) => state.user);

  if (user?.status === "INACTIVE") {
    return (
      <View className="flex-1 bg-background-default items-center justify-center px-8">
        <StatusBar style="dark" />
        <Text className="font-body text-base text-text-muted text-center">
          Tính năng đang tạm khoá. Vui lòng thử lại sau
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-default items-center justify-center">
      <StatusBar style="dark" />
      <Text className="text-text-muted text-xl font-heading">Ôn tập</Text>
      <Text className="text-text-muted text-sm font-body mt-2">
        Tính năng đang được phát triển
      </Text>
    </View>
  );
}
