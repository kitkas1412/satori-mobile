import { PrimaryButton } from "@/components/ui";
import { useChangePassword } from "@/features/authentication/hooks";
import { getPasswordValidationStatus } from "@/features/authentication/utils/password-validation";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { BackButton, PasswordInput, PasswordValidation } from "../components";

export function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const { logout } = useAuthStore();
  const { mutate: changePassword, isPending } = useChangePassword();

  const handleSubmit = () => {
    if (!isFormValid) return;

    changePassword(
      {
        currentPassword,
        newPassword,
        confirmPassword,
      },
      {
        onSuccess: (data) => {
          Alert.alert("Thành công", data.message || "Đổi mật khẩu thành công", [
            {
              text: "OK",
              onPress: () => {
                logout();
                router.replace("/(auth)/login");
              },
            },
          ]);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra khi đổi mật khẩu";
          Alert.alert("Lỗi", errorMessage);
        },
      },
    );
  };

  const isFormValid =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[a-z]/.test(newPassword) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) &&
    newPassword === confirmPassword;

  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsDontMatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

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
            editable={!isPending}
            autoFocus={true}
            onSubmitEditing={() => newPasswordRef.current?.focus()}
            returnKeyType="next"
          />

          <PasswordInput
            ref={newPasswordRef}
            value={newPassword}
            onChangeText={setNewPassword}
            label="Mật khẩu mới"
            editable={!isPending}
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            returnKeyType="next"
          />

          <View className="mt-4 mb-4">
            <PasswordValidation
              rules={getPasswordValidationStatus(newPassword)}
            />
          </View>

          <PasswordInput
            ref={confirmPasswordRef}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            label="Xác nhận mật khẩu mới"
            editable={!isPending}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />

          {passwordsDontMatch && (
            <Text className="font-body text-[12px] text-red-500 mt-2">
              Mật khẩu không khớp
            </Text>
          )}

          {passwordsMatch && (
            <Text className="font-body text-[12px] text-green-500 mt-2">
              Mật khẩu khớp
            </Text>
          )}
        </View>

        <View className="flex-1" />

        <View className="px-4 mb-5">
          <PrimaryButton
            text="Đổi mật khẩu"
            onPress={handleSubmit}
            disabled={!isFormValid || isPending}
            loading={isPending}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
