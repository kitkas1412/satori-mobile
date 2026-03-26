import { IconButton, PrimaryButton } from "@/components/ui";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Colors } from "@/constants/theme";
import { useResetPasswordForm } from "@/features/authentication/hooks";
import { getPasswordValidationStatus } from "@/features/authentication/utils/password-validation";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { PasswordInput, PasswordValidation } from "../components";

export function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ resetToken?: string }>();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const {
    newPassword,
    confirmPassword,
    submitError,
    confirmPasswordRef,
    isFormValid,
    passwordsDontMatch,
    isLoading,
    setNewPassword,
    setConfirmPassword,
    handleSubmit,
  } = useResetPasswordForm(params.resetToken ?? "", () =>
    router.replace("/(auth)/reset-password-success"),
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: theme.background.page }}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView className="flex-1">
        <View className="flex-col px-4">
          <IconButton icon={<ArrowLeft size={24} color={theme.icon.primary} />} onPress={() => router.back()} />

          <PasswordInput
            value={newPassword}
            onChangeText={setNewPassword}
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            editable={!isLoading}
            autoFocus={true}
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            returnKeyType="next"
          />

          <View className="mt-3">
            <PasswordValidation
              rules={getPasswordValidationStatus(newPassword)}
            />
          </View>

          <PasswordInput
            ref={confirmPasswordRef}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            label="Xác nhận mật khẩu mới"
            placeholder="Nhập lại mật khẩu mới"
            error={passwordsDontMatch ? "Mật khẩu không trùng khớp" : undefined}
            editable={!isLoading}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />

          {submitError ? (
            <Text className="font-body text-xs text-error-default mt-2">
              {submitError}
            </Text>
          ) : null}
        </View>
      </SafeAreaView>

      <View className="px-4 pb-4">
        <PrimaryButton
          text="Tiếp tục"
          onPress={handleSubmit}
          disabled={!isFormValid || isLoading}
          loading={isLoading}
        />
      </View>

      <LoadingOverlay visible={isLoading} />
    </KeyboardAvoidingView>
  );
}
