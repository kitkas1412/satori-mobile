import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function PracticeScreen() {
  return (
    <View className="flex-1 bg-[#F6F7F9] items-center justify-center">
      <StatusBar style="dark" />
      <Text className="text-[#475569] text-xl font-bold">Ôn tập</Text>
    </View>
  );
}
