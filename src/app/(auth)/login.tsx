import {
  BackButton,
  EmailInput,
  ForgotPasswordLink,
  LoginButton,
  LoginHeader,
  LoginLoadingOverlay,
  PasswordInput,
} from "@/features/authentication/components";
import { useLogin } from "@/hooks/api/use-auth";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const loginMutation = useLogin();

  useEffect(() => {
    if (loginMutation.isPending) {
      Keyboard.dismiss();
    }
  }, [loginMutation.isPending]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError && text.trim()) {
      setEmailError("");
    }
    if (loginError) {
      setLoginError("");
    }
  };

  const handleEmailBlur = () => {
    if (email.trim() && !validateEmail(email.trim())) {
      setEmailError("Hãy nhập email hợp lệ");
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (loginError) {
      setLoginError("");
    }
  };

  const handleSubmit = async () => {
    try {
      await loginMutation.mutateAsync({
        email: email.trim(),
        password: password.trim(),
      });
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      setLoginError(errorMessage);
    }
  };

  const isFormValid =
    email.trim() &&
    password.trim() &&
    !emailError &&
    validateEmail(email.trim());

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

            <LoginHeader
              title="Nhập địa chỉ email của bạn"
              subtitle="Hãy sử dụng địa chỉ email đã được xác nhận với trung tâm"
            />

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
              label="Nhập mật khẩu"
            />

            <ForgotPasswordLink
              onPress={() => {
                console.log("Forgot password pressed");
              }}
            />
          </View>

          <View className="flex-1" />

          <View className="px-4 pb-6">
            <LoginButton
              onPress={handleSubmit}
              disabled={loginMutation.isPending || !isFormValid}
              isLoading={loginMutation.isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoginLoadingOverlay visible={loginMutation.isPending} />
    </>
  );
}
