import { BackButton } from "@/features/authentication/components";
import { useForgotPassword } from "@/features/authentication/hooks";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleSubmit = () => {
    if (!email) return;

    forgotPassword(
      { email },
      {
        onSuccess: (data) => {
          // Navigate to OTP screen with email parameter
          router.push({
            pathname: "/(auth)/reset-password-otp",
            params: { email },
          });
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra khi gửi email khôi phục mật khẩu";
          Alert.alert("Lỗi", errorMessage);
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-[#F6F7F9]"
      keyboardVerticalOffset={0}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="always"
      >
        <View className="flex-col px-4 pt-16 pb-4">
          <BackButton onPress={() => router.push("/(auth)/login")} />

          <View className="flex-col items-start mt-8">
            <Text className="font-heading text-[17px] leading-[22px] text-black">
              Quên mật khẩu
            </Text>
            <Text className="font-bodys text-[12px] text-black mt-1">
              Chúng tôi sẽ gửi cho bạn một liên kết đến địa chỉ email này
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={1}
            className="mt-6 rounded-[8px] border border-[rgba(0,0,0,0.38)] px-[14px] py-[16.5px] flex-row items-center gap-[16px] bg-white"
          >
            <MaterialIcons
              name="mail-outline"
              size={24}
              color="rgba(0,0,0,0.6)"
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập địa chỉ email của bạn"
              placeholderTextColor="rgba(0,0,0,0.6)"
              className="flex-1 font-body text-[16px] text-black"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
              editable={!isPending}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-1" />

        <View className="px-4 pb-8">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!email || isPending}
            className={`rounded-[14px] items-center justify-center px-[14px] py-[16.5px] flex-row ${
              !email || isPending ? "bg-gray-300" : "bg-primary-default"
            }`}
            accessibilityRole="button"
            accessibilityLabel="Tiếp tục"
          >
            {isPending ? (
              <ActivityIndicator color="#F3F4F6" />
            ) : (
              <Text className="font-heading text-[18px] text-[#F3F4F6]">
                Tiếp tục
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
