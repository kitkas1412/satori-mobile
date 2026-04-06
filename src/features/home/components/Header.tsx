import { BellButton } from "@/components/ui";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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

      <BellButton onPress={() => router.push("/notifications")} />
    </View>
  );
}
