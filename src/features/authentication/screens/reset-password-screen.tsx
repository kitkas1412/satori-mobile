import { PrimaryButton } from "@/components/ui";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useResetPassword } from "@/features/authentication/hooks";
import { getPasswordValidationStatus } from "@/features/authentication/utils/password-validation";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton, PasswordInput, PasswordValidation } from "../components";

export function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ resetToken?: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const confirmPasswordRef = useRef<TextInput>(null);

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
        onSuccess: () => {
          router.replace("/(auth)/reset-password-success");
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
    /[0-9]/.test(newPassword) &&
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
      <SafeAreaView className="flex-1">
        <View className="flex-col px-4 ">
          {/* Back Button */}
          <BackButton onPress={() => router.back()} />

          {/* New Password Input */}
          <PasswordInput
            value={newPassword}
            onChangeText={setNewPassword}
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            editable={!isPending}
            autoFocus={true}
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            returnKeyType="next"
          />

          {/* Password Validation */}
          <View className="mt-3">
            <PasswordValidation
              rules={getPasswordValidationStatus(newPassword)}
            />
          </View>

          {/* Confirm Password Input */}
          <PasswordInput
            ref={confirmPasswordRef}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            label="Xác nhận mật khẩu mới"
            placeholder="Nhập lại mật khẩu mới"
            error={passwordsDontMatch ? "Mật khẩu mới không khớp" : undefined}
            editable={!isPending}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
        </View>
      </SafeAreaView>

      {/* Continue Button - Fixed at bottom */}
      <View className="px-4 pb-4">
        <PrimaryButton
          text="Tiếp tục"
          onPress={handleSubmit}
          disabled={!isFormValid || isPending}
          loading={isPending}
        />
      </View>

      <LoadingOverlay visible={isPending} />
    </KeyboardAvoidingView>
  );
}
