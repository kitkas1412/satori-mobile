import { PrimaryButton } from "@/components/ui";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
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
  const [currentPasswordError, setCurrentPasswordError] = useState("");
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
        onSuccess: () => {
          Alert.alert(
            "Thành công",
            "Vui lòng đăng nhập lại với mật khẩu mới.",
            [
              {
                text: "OK",
                onPress: () => {
                  logout();
                  router.replace("/(auth)/login");
                },
              },
            ],
          );
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra khi đổi mật khẩu";

          // Kiểm tra nếu lỗi là do mật khẩu hiện tại sai
          if (
            errorMessage.toLowerCase().includes("mật khẩu hiện tại") ||
            errorMessage.toLowerCase().includes("incorrect password") ||
            errorMessage.toLowerCase().includes("wrong password") ||
            errorMessage.toLowerCase().includes("current password")
          ) {
            setCurrentPasswordError(errorMessage);
          } else {
            Alert.alert("Lỗi", errorMessage);
          }
        },
      },
    );
  };

  const isFormValid =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[a-z]/.test(newPassword) &&
    /[0-9]/.test(newPassword) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) &&
    newPassword === confirmPassword &&
    newPassword !== currentPassword;

  const passwordsDontMatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const newPasswordSameAsOld =
    newPassword.length > 0 &&
    currentPassword.length > 0 &&
    newPassword === currentPassword;

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
            onChangeText={(text) => {
              setCurrentPassword(text);
              if (currentPasswordError) {
                setCurrentPasswordError("");
              }
            }}
            label="Mật khẩu hiện tại"
            error={!!currentPasswordError}
            editable={!isPending}
            autoFocus={true}
            onSubmitEditing={() => newPasswordRef.current?.focus()}
            returnKeyType="next"
          />

          {currentPasswordError && (
            <Text className="font-body text-[12px] text-red-500 mt-2">
              {currentPasswordError}
            </Text>
          )}

          <PasswordInput
            ref={newPasswordRef}
            value={newPassword}
            onChangeText={setNewPassword}
            label="Mật khẩu mới"
            editable={!isPending}
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            returnKeyType="next"
          />

          {newPasswordSameAsOld && (
            <Text className="font-body text-[12px] text-red-500 mt-2">
              Mật khẩu mới phải khác mật khẩu hiện tại
            </Text>
          )}

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
            error={passwordsDontMatch ? "Mật khẩu mới không khớp" : undefined}
            editable={!isPending}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
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

      <LoadingOverlay visible={isPending} />
    </KeyboardAvoidingView>
  );
}
