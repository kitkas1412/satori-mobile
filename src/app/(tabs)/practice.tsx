import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function PracticeScreen() {
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
