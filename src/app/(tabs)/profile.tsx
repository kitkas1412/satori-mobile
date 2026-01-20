import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-background-default items-center justify-center">
      <StatusBar style="dark" />
      <Text className="text-text-muted text-xl font-bold">Cá nhân</Text>
    </View>
  );
}
