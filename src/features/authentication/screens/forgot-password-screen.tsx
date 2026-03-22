import { IconButton, PrimaryButton } from "@/components/ui";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useForgotPasswordForm } from "@/features/authentication/hooks";
import { useRouter } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { EmailInput, SectionHeader } from "../components";

export function ForgotPasswordScreen() {
  const router = useRouter();
  const {
    email,
    emailError,
    submitError,
    emailInputRef,
    isFormValid,
    isLoading,
    handleEmailChange,
    handleEmailBlur,
    handleSubmit,
  } = useForgotPasswordForm((email) =>
    router.push({
      pathname: "/(auth)/reset-password-otp",
      params: { email },
    }),
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-[hsl(220,20%,97%)]"
      keyboardVerticalOffset={0}
    >
      <SafeAreaView className="flex-1">
        <View className="flex-col px-4">
          <IconButton icon={<ArrowLeft size={24} color="hsla(0, 0%, 0%, 0.6)" />} onPress={() => router.back()} />

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
            error={submitError || emailError}
            autoFocus={true}
          />
        </View>

        <View className="flex-1" />

        <View className="px-4">
          <PrimaryButton
            text="Gửi mã OTP"
            onPress={handleSubmit}
            disabled={!isFormValid || isLoading}
            loading={isLoading}
          />
        </View>
      </SafeAreaView>

      <LoadingOverlay visible={isLoading} />
    </KeyboardAvoidingView>
  );
}
