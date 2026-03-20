import { Image } from "expo-image";
import { Bell } from "lucide-react-native";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Header() {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-row items-center justify-between px-4 pb-4"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center gap-2">
        <Image
          source={require("../../../../assets/images/avatar.png")}
          style={{ width: 36, height: 36, borderRadius: 18 }}
        />
        <View className="flex-row items-center">
          <Text className="text-text-muted text-xl font-heading ">
            Chào bạn{" "}
          </Text>
          <Image
            source={require("../../../../assets/images/waving-hand.png")}
            style={{ width: 24, height: 24 }}
          />
        </View>
      </View>

      <View className="relative">
        <View className="w-9 h-9 bg-secondary-default rounded-full items-center justify-center">
          <Bell className="w-6 h-6" />
        </View>
        <View className="absolute top-1.5 right-0 w-1.5 h-1.5 bg-error-500 rounded-full" />
      </View>
    </View>
  );
}
