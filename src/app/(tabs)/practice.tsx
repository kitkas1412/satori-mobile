import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

import { useAuthStore } from "@/stores/auth-store";
import { PracticeScreen } from "@/features/practice/screens/practice-screen";

export default function PracticeTab() {
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

  return <PracticeScreen />;
}
