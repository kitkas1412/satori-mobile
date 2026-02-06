import {
  BackButton,
  PasswordInput,
} from "@/features/authentication/components";
import { PasswordValidation } from "@/features/authentication/components/password-validation";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    console.log("Change password submitted");
  };

  const isFormValid =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[a-z]/.test(newPassword) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) &&
    newPassword === confirmPassword;

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-background-default"
      keyboardVerticalOffset={0}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="always"
      >
        <View className="flex-col px-4 pt-16 pb-4">
          <BackButton onPress={() => router.back()} />

          <PasswordInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            label="Mật khẩu hiện tại"
          />

          <PasswordInput
            value={newPassword}
            onChangeText={setNewPassword}
            label="Mật khẩu mới"
          />

          <View className="mt-4">
            <PasswordValidation password={newPassword} />
          </View>

          <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            label="Xác nhận mật khẩu mới"
          />
        </View>

        <View className="flex-1" />

        <View className="px-4 mb-5">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isFormValid}
            className={`rounded-[8px] items-center justify-center px-[14px] py-[16.5px] ${
              isFormValid ? "bg-primary-default" : "bg-gray-300"
            }`}
            accessibilityRole="button"
            accessibilityLabel="Đăng nhập"
          >
            <Text className="font-heading text-[18px] text-[#F3F4F6]">
              Đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
