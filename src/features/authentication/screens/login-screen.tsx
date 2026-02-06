import {
  BackButton,
  EmailInput,
  LoadingOverlay,
  PasswordInput,
  PrimaryButton,
  SectionHeader,
} from "@/components/ui";
import { ForgotPasswordLink } from "@/features/authentication/components";
import { useLoginForm } from "@/features/authentication/hooks";
import { useRouter } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";

export function LoginScreen() {
  const router = useRouter();
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
            />

            <PasswordInput
              ref={passwordInputRef}
              value={password}
              onChangeText={handlePasswordChange}
              error={!!loginError}
            />

            <ForgotPasswordLink
              onPress={() => {
                router.push("/(auth)/forgot-password");
              }}
            />
          </View>

          <View className="flex-1" />

          <View className="px-4 mb-5">
            <PrimaryButton
              text="Đăng nhập"
              onPress={handleSubmit}
              disabled={isLoading || !isFormValid}
              loading={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={isLoading} />
    </>
  );
}
