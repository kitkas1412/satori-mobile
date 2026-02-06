import {
  BackButton,
  PasswordInput,
} from "@/features/authentication/components";
import { PasswordValidation } from "@/features/authentication/components/password-validation";
import { useResetPassword } from "@/features/authentication/hooks";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ resetToken?: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate: resetPassword, isPending } = useResetPassword();

  const handleSubmit = () => {
    if (!isFormValid) return;

    if (!params.resetToken) {
      Alert.alert("Lỗi", "Thông tin đặt lại mật khẩu không hợp lệ");
      return;
    }

    resetPassword(
      {
        resetToken: params.resetToken,
        newPassword,
        confirmPassword,
      },
      {
        onSuccess: (data) => {
          Alert.alert(
            "Thành công",
            data.message || "Đặt lại mật khẩu thành công",
            [
              {
                text: "OK",
                onPress: () => router.replace("/(auth)/login"),
              },
            ],
          );
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra khi đặt lại mật khẩu";
          Alert.alert("Lỗi", errorMessage);
        },
      },
    );
  };

  const isFormValid =
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[a-z]/.test(newPassword) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) &&
    newPassword === confirmPassword;

  const passwordsDontMatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#F6F7F9]"
      keyboardVerticalOffset={0}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-col px-4 pt-16 pb-4">
          {/* Back Button */}
          <BackButton onPress={() => router.back()} />

          {/* New Password Input */}
          <PasswordInput
            value={newPassword}
            onChangeText={setNewPassword}
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            editable={!isPending}
          />

          {/* Password Validation */}
          <View className="mt-3">
            <PasswordValidation password={newPassword} />
          </View>

          {/* Confirm Password Input */}
          <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            label="Xác nhận mật khẩu mới"
            placeholder="Nhập lại mật khẩu mới"
            error={passwordsDontMatch}
            editable={!isPending}
          />
        </View>
      </ScrollView>

      {/* Continue Button - Fixed at bottom */}
      <View className="px-4 pb-4">
        <TouchableOpacity
          className={`rounded-lg px-[14px] py-[16.5px] items-center flex-row justify-center ${
            isFormValid && !isPending ? "bg-[#7B92EF]" : "bg-gray-400"
          }`}
          onPress={handleSubmit}
          disabled={!isFormValid || isPending}
          activeOpacity={0.8}
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
    </KeyboardAvoidingView>
  );
}
