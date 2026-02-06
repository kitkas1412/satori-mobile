import { BackButton } from "@/features/authentication/components";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

  const handleSubmit = () => {
    // TODO: Implement forgot password logic
    console.log("Forgot password for:", email);
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
            />
          </TouchableOpacity>
        </View>

        <View className="flex-1" />

        <View className="px-4 pb-8">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!email}
            className={`rounded-[14px] items-center justify-center px-[14px] py-[16.5px] ${
              !email ? "bg-gray-300" : "bg-primary-default"
            }`}
            accessibilityRole="button"
            accessibilityLabel="Tiếp tục"
          >
            <Text className="font-heading text-[18px] text-[#F3F4F6]">
              Tiếp tục
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
