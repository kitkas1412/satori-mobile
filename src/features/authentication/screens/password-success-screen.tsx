import { PrimaryButton } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function PasswordSuccessScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const handleBackToLogin = () => {
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background.page }}>
      <View className="flex-1 items-center px-4">
        <View className="mt-[126px] mb-[46px]">
          <Image
            source={require("../../../../assets/images/tick-dynamic-color.png")}
            className="w-[90px] h-[90px]"
            resizeMode="contain"
          />
        </View>

        <Text className="font-heading text-2xl text-center font-bold mb-6" style={{ color: theme.text.primary }}>
          Thay đổi mật khẩu thành công!
        </Text>

        <Text className="font-body text-sm text-center w-[312px]" style={{ color: theme.text.secondary }}>
          Mật khẩu của bạn đã được thay đổi thành công. Vui lòng đăng nhập lại
          với mật khẩu mới.
        </Text>
      </View>

      <View className="px-4 pb-4">
        <PrimaryButton text="Quay lại đăng nhập" onPress={handleBackToLogin} />
      </View>
    </SafeAreaView>
  );
}
