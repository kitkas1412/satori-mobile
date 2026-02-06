import {
  BackButton,
  EmailInput,
  PrimaryButton,
  SectionHeader,
} from "@/components/ui";
import { useForgotPassword } from "@/features/authentication/hooks";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  View,
} from "react-native";

export function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const emailInputRef = useRef<TextInput>(null);
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleSubmit = () => {
    if (!email) return;

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
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="always"
      >
        <View className="flex-col px-4 pt-16 pb-4">
          <BackButton onPress={() => router.push("/(auth)/login")} />

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
            onChangeText={setEmail}
            onBlur={() => {}}
            autoFocus={true}
          />
        </View>

        <View className="flex-1" />

        <View className="px-4 pb-8">
          <PrimaryButton
            text="Gửi mã OTP"
            onPress={handleSubmit}
            disabled={!email || isPending}
            loading={isPending}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
