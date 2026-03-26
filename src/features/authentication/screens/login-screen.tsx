import { IconButton, LoadingOverlay, PrimaryButton } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useLoginForm } from "@/features/authentication/hooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  EmailInput,
  ForgotPasswordLink,
  PasswordInput,
  SectionHeader,
} from "../components";

export function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const {
    email,
    password,
    emailError,
    loginError,
    emailInputRef,
    passwordInputRef,
    isLoading,
    isFormValid,
    handleEmailChange,
    handleEmailBlur,
    handlePasswordChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
        style={{ backgroundColor: theme.background.page }}
        keyboardVerticalOffset={0}
      >
        <SafeAreaView className="flex-1">
          <View className="flex-col px-4">
            <IconButton icon={<ArrowLeft size={24} color={theme.icon.primary} />} onPress={() => router.back()} />

            <View className="mt-8">
              <SectionHeader
                title="Nhập địa chỉ email của bạn"
                subtitle="Hãy sử dụng địa chỉ email đã được xác nhận với trung tâm"
                alignment="left"
              />
            </View>

            <EmailInput
              ref={emailInputRef}
              value={email}
              onChangeText={handleEmailChange}
              onBlur={handleEmailBlur}
              error={loginError || emailError}
              hasLoginError={!!loginError}
              autoFocus={true}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              returnKeyType="next"
            />

            <PasswordInput
              ref={passwordInputRef}
              value={password}
              onChangeText={handlePasswordChange}
              error={!!loginError}
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
            />

            <ForgotPasswordLink
              onPress={() => {
                router.push("/(auth)/forgot-password");
              }}
            />
          </View>

          <View className="flex-1" />

          <View className="px-4">
            <PrimaryButton
              text="Đăng nhập"
              onPress={handleSubmit}
              disabled={isLoading || !isFormValid}
              loading={isLoading}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={isLoading} />
    </>
  );
}
