import { IconButton, PrimaryButton } from "@/components/ui";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Colors } from "@/constants/theme";
import { useChangePasswordForm } from "@/features/authentication/hooks";
import { getPasswordValidationStatus } from "@/features/authentication/utils/password-validation";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { PasswordInput, PasswordValidation } from "../components";

export function ChangePasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const {
    currentPassword,
    newPassword,
    confirmPassword,
    currentPasswordError,
    newPasswordRef,
    confirmPasswordRef,
    isFormValid,
    passwordsDontMatch,
    newPasswordSameAsOld,
    isLoading,
    setNewPassword,
    setConfirmPassword,
    handleCurrentPasswordChange,
    handleSubmit,
  } = useChangePasswordForm(() => router.replace("/(auth)/login"));

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1"
      style={{ backgroundColor: theme.background.page }}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="always"
      >
        <View className="flex-col px-4 pb-4" style={{ paddingTop: insets.top }}>
          <IconButton
            icon={<ArrowLeft size={24} color={theme.icon.primary} />}
            onPress={() => router.back()}
          />

          <PasswordInput
            value={currentPassword}
            onChangeText={handleCurrentPasswordChange}
            label="Mật khẩu hiện tại"
            error={!!currentPasswordError}
            editable={!isLoading}
            autoFocus={true}
            onSubmitEditing={() => newPasswordRef.current?.focus()}
            returnKeyType="next"
          />

          {currentPasswordError && (
            <Text className="font-body text-xs text-error-default mt-2">
              {currentPasswordError}
            </Text>
          )}

          <PasswordInput
            ref={newPasswordRef}
            value={newPassword}
            onChangeText={setNewPassword}
            label="Mật khẩu mới"
            error={
              newPasswordSameAsOld
                ? "Mật khẩu mới phải khác mật khẩu hiện tại"
                : undefined
            }
            editable={!isLoading}
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
            error={passwordsDontMatch ? "Mật khẩu không trùng khớp" : undefined}
            editable={!isLoading}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
        </View>

        <View className="flex-1" />

        <View className="px-4 mb-5">
          <PrimaryButton
            text="Xác nhận"
            onPress={handleSubmit}
            disabled={!isFormValid || isLoading}
            loading={isLoading}
          />
        </View>
      </ScrollView>

      <LoadingOverlay visible={isLoading} />
    </KeyboardAvoidingView>
  );
}
