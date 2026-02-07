import { PrimaryButton } from "@/components/ui";
import { useForgotPassword } from "@/features/authentication/hooks";
import { validateEmail } from "@/features/authentication/utils";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton, EmailInput, SectionHeader } from "../components";

export function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const emailInputRef = useRef<TextInput>(null);
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError && text.trim()) {
      setEmailError("");
    }
  };

  const handleEmailBlur = () => {
    if (email.trim() && !validateEmail(email.trim())) {
      setEmailError("Hãy nhập email hợp lệ");
    }
  };

  const handleSubmit = () => {
    if (!email || !validateEmail(email.trim())) {
      setEmailError("Hãy nhập email hợp lệ");
      return;
    }

    forgotPassword(
      { email },
      {
        onSuccess: (data) => {
          // Navigate to OTP screen with email parameter
          router.push({
            pathname: "/(auth)/reset-password-otp",
            params: { email },
          });
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra khi gửi email khôi phục mật khẩu";
          Alert.alert("Lỗi", errorMessage);
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-[#F6F7F9]"
      keyboardVerticalOffset={0}
    >
      <SafeAreaView className="flex-1">
        <View className="flex-col px-4">
          <BackButton onPress={() => router.back()} />

          <View className="mt-8">
            <SectionHeader
              title="Quên mật khẩu"
              subtitle="Chúng tôi sẽ gửi cho bạn một liên kết đến địa chỉ email này"
              alignment="left"
            />
          </View>

          <EmailInput
            ref={emailInputRef}
            value={email}
            onChangeText={handleEmailChange}
            onBlur={handleEmailBlur}
            error={emailError}
            autoFocus={true}
          />
        </View>

        <View className="flex-1" />

        <View className="px-4">
          <PrimaryButton
            text="Gửi mã OTP"
            onPress={handleSubmit}
            disabled={!email || !!emailError || isPending}
            loading={isPending}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
