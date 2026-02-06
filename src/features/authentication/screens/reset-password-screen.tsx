import {
  BackButton,
  PasswordInput,
  PasswordValidation,
  PrimaryButton,
} from "@/components/ui";
import { useResetPassword } from "@/features/authentication/hooks";
import { getPasswordValidationStatus } from "@/features/authentication/utils/password-validation";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
            <PasswordValidation
              rules={getPasswordValidationStatus(newPassword)}
            />
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
        <PrimaryButton
          text="Tiếp tục"
          onPress={handleSubmit}
          disabled={!isFormValid || isPending}
          loading={isPending}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
