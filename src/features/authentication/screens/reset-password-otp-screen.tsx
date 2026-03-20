import { PrimaryButton } from "@/components/ui";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useResetPasswordOTPForm } from "@/features/authentication/hooks";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton, OTPInput, SectionHeader } from "../components";

export function ResetPasswordOTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email || "email@example.com";

  const {
    otp,
    countdown,
    verifyError,
    resendMessage,
    resendError,
    isButtonDisabled,
    canResend,
    isPending,
    isResendPending,
    handleOTPChange,
    handleResendOTP,
    handleContinue,
  } = useResetPasswordOTPForm(email, (resetToken) =>
    router.push({
      pathname: "/(auth)/reset-password",
      params: { email, resetToken },
    }),
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[hsl(220,20%,97%)]"
      keyboardVerticalOffset={0}
    >
      <SafeAreaView className="flex-1">
        <View className="flex-col px-4">
          <BackButton onPress={() => router.back()} />

          <View className="mt-8">
            <SectionHeader title="Thay đổi mật khẩu" />
          </View>

          <Text className="font-body text-xs text-black mt-7">
            Một email chứa OTP đặt lại mật khẩu đã được gửi đến địa chỉ email
            của bạn:
          </Text>

          <Text className="font-heading text-xs text-[hsl(40,90%,53%)] mt-3">
            {email}
          </Text>

          <View className="mt-9">
            <Text className="font-heading text-lg text-black mb-3">
              Nhập mã OTP
            </Text>

            <OTPInput
              length={6}
              value={otp}
              onChangeText={handleOTPChange}
              autoFocus={true}
            />

            {verifyError ? (
              <Text className="font-body text-xs text-error-default mt-2">
                {verifyError}
              </Text>
            ) : null}

            {resendMessage ? (
              <Text className="font-body text-xs text-success-default mt-2">
                {resendMessage}
              </Text>
            ) : null}

            {resendError ? (
              <Text className="font-body text-xs text-error-default mt-2">
                {resendError}
              </Text>
            ) : null}

            <View className="flex-row items-center justify-center mt-3">
              <Text className="font-body text-xs text-[hsl(220,9%,46%)]">
                Không nhận được mã?{" "}
              </Text>
              <TouchableOpacity onPress={handleResendOTP} disabled={!canResend}>
                <Text
                  className={`font-body text-xs ${canResend ? "text-[hsl(228,78%,71%)]" : "text-[hsl(218,11%,65%)]"}`}
                >
                  {isResendPending
                    ? "Đang gửi..."
                    : countdown > 0
                      ? `Gửi lại (${countdown}s)`
                      : "Gửi lại"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <View className="px-4 pb-4">
        <PrimaryButton
          text="Tiếp tục"
          onPress={handleContinue}
          disabled={isButtonDisabled}
          loading={isPending}
        />
      </View>

      <LoadingOverlay visible={isPending || isResendPending} />
    </KeyboardAvoidingView>
  );
}
