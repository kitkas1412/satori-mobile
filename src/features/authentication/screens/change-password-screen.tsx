import {
  BackButton,
  PasswordInput,
} from "@/features/authentication/components";
import { PasswordValidation } from "@/features/authentication/components/password-validation";
import { useChangePassword } from "@/features/authentication/hooks";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logoutOtherDevices, setLogoutOtherDevices] = useState(true);

  const { mutate: changePassword, isPending } = useChangePassword();

  const handleSubmit = () => {
    if (!isFormValid) return;

    changePassword(
      {
        currentPassword,
        newPassword,
        confirmPassword,
        logoutOtherDevices,
      },
      {
        onSuccess: (data) => {
          Alert.alert("Thành công", data.message || "Đổi mật khẩu thành công", [
            {
              text: "OK",
              onPress: () => router.back(),
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
    /[0-9]/.test(newPassword) &&
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

          <Text className="font-heading text-[24px] text-black mb-6">
            Đổi mật khẩu
          </Text>

          <PasswordInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            label="Mật khẩu hiện tại"
            editable={!isPending}
          />

          <PasswordInput
            value={newPassword}
            onChangeText={setNewPassword}
            label="Mật khẩu mới"
            editable={!isPending}
          />

          <View className="mt-4 mb-4">
            <PasswordValidation password={newPassword} />
          </View>

          <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            label="Xác nhận mật khẩu mới"
            editable={!isPending}
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

          <View className="flex-row items-center justify-between mt-6 py-3">
            <Text className="font-body text-[14px] text-black flex-1">
              Đăng xuất các thiết bị khác
            </Text>
            <Switch
              value={logoutOtherDevices}
              onValueChange={setLogoutOtherDevices}
              disabled={isPending}
            />
          </View>
        </View>

        <View className="flex-1" />

        <View className="px-4 mb-5">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isFormValid || isPending}
            className={`rounded-[8px] items-center justify-center px-[14px] py-[16.5px] ${
              isFormValid && !isPending ? "bg-primary-default" : "bg-gray-300"
            }`}
            accessibilityRole="button"
            accessibilityLabel="Đổi mật khẩu"
          >
            {isPending ? (
              <ActivityIndicator color="#F3F4F6" />
            ) : (
              <Text className="font-heading text-[18px] text-[#F3F4F6]">
                Đổi mật khẩu
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
