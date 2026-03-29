import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import {
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { Colors } from "@/constants/theme";

export function WelcomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  const handleContinue = () => {
    router.push("/(auth)/login");
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
      <StatusBar barStyle="dark-content" />

      <View className="w-full h-[452px]">
        <Image
          source={require("../../../../assets/images/welcome.png")}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <Text className="text-center font-bold text-2xl mt-[120px]" style={{ color: theme.text.primary }}>
        Đăng nhập để bắt đầu
      </Text>

      <View className="items-center mt-[54px]">
        <TouchableOpacity
          onPress={handleContinue}
          className="rounded-full w-[100px] h-[100px] items-center justify-center"
          style={{ backgroundColor: theme.brand.primary }}
        >
          <ArrowRight size={44} color="white" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {Platform.OS === "ios" && (
        <View className="absolute bottom-2 left-0 right-0 items-center">
          <View className="w-[134px] h-[5px] rounded-full" style={{ backgroundColor: theme.text.primary }} />
        </View>
      )}
    </View>
  );
}
