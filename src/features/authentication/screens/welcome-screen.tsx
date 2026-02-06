import { useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import React from "react";
import {
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

export function WelcomeScreen() {
  const router = useRouter();

  const handleEmailLogin = () => {
    router.push("/(auth)/login");
  };

  const handleGoogleLogin = () => {
    console.log("Google Sign In pressed");
  };

  return (
    <View className="flex-1 bg-background-default">
      <StatusBar barStyle="dark-content" />

      <View className="w-full h-[452px]">
        <Image
          source={require("../../../../assets/images/welcome.png")}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <Text className="text-center text-black font-bold text-2xl mt-14">
        Đăng nhập để bắt đầu
      </Text>

      <View className="px-6 mt-[55px] gap-4">
        <TouchableOpacity
          onPress={handleEmailLogin}
          className="bg-primary-default rounded-[14px] py-[18px] flex-row items-center justify-center gap-3 shadow-lg"
        >
          <Mail size={20} color="white" />
          <Text className="text-white font-bold text-lg">
            Đăng nhập với email
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center gap-4">
          <View className="flex-1 h-[1px] bg-[#d1d5db]" />
          <Text className="text-[#9ca3af] text-[14px]">hoặc</Text>
          <View className="flex-1 h-[1px] bg-[#d1d5db]" />
        </View>

        <TouchableOpacity
          onPress={handleGoogleLogin}
          className="bg-white rounded-[14px] py-[18px] flex-row items-center justify-center gap-3 shadow-md"
        >
          <GoogleIcon />
          <Text className="text-[#1f2937] font-bold text-[18px]">
            Đăng nhập với Google
          </Text>
        </TouchableOpacity>
      </View>

      {Platform.OS === "ios" && (
        <View className="absolute bottom-2 left-0 right-0 items-center">
          <View className="w-[134px] h-[5px] bg-[#757575] rounded-full" />
        </View>
      )}
    </View>
  );
}

function GoogleIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20">
      <Path
        d="M19.6 10.2273C19.6 9.51821 19.5364 8.83639 19.4182 8.18185H10V12.0495H15.3818C15.15 13.3 14.4455 14.3586 13.3864 15.0677V17.5768H16.6182C18.5091 15.8359 19.6 13.2723 19.6 10.2273Z"
        fill="#4285F4"
      />
      <Path
        d="M10 20C12.7 20 14.9636 19.1046 16.6182 17.5768L13.3864 15.0677C12.4909 15.6682 11.3455 16.0228 10 16.0228C7.39545 16.0228 5.19091 14.2637 4.40455 11.9H1.06364V14.4909C2.70909 17.7591 6.09091 20 10 20Z"
        fill="#34A853"
      />
      <Path
        d="M4.40455 11.9C4.20455 11.3 4.09091 10.6591 4.09091 10C4.09091 9.34091 4.20455 8.7 4.40455 8.1V5.50909H1.06364C0.386364 6.85909 0 8.38636 0 10C0 11.6136 0.386364 13.1409 1.06364 14.4909L4.40455 11.9Z"
        fill="#FBBC04"
      />
      <Path
        d="M10 3.97727C11.4682 3.97727 12.7864 4.48182 13.8227 5.47273L16.6909 2.60455C14.9591 0.990909 12.6955 0 10 0C6.09091 0 2.70909 2.24091 1.06364 5.50909L4.40455 8.1C5.19091 5.73636 7.39545 3.97727 10 3.97727Z"
        fill="#EA4335"
      />
    </Svg>
  );
}
