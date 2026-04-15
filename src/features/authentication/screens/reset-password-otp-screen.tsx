import { IconButton, PrimaryButton } from "@/components/ui";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Colors } from "@/constants/theme";
import { useResetPasswordOTPForm } from "@/features/authentication/hooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OTPInput, SectionHeader } from "../components";

export function ResetPasswordOTPScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
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
      className="flex-1"
      style={{ backgroundColor: theme.background.page }}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView className="flex-1">
        <View className="flex-col px-4">
          <IconButton icon={<ChevronLeft size={24} color={theme.icon.primary} />} onPress={() => router.back()} />

          <View className="mt-8">
            <SectionHeader title="Thay đổi mật khẩu" />
          </View>

          <Text className="font-body text-xs mt-7" style={{ color: theme.text.primary }}>
            Một email chứa OTP đặt lại mật khẩu đã được gửi đến địa chỉ email
            của bạn:
          </Text>

          <Text className="font-heading text-xs mt-3" style={{ color: theme.warning.default }}>
            {email}
          </Text>

          <View className="mt-9">
            <Text className="font-heading text-lg mb-3" style={{ color: theme.text.primary }}>
              Nhập mã OTP
            </Text>

            <OTPInput
              length={6}
              value={otp}
              onChangeText={handleOTPChange}
              autoFocus={true}
              theme={theme}
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
              <Text className="font-body text-xs" style={{ color: theme.text.tertiary }}>
                Không nhận được mã?{" "}
              </Text>
              <TouchableOpacity onPress={handleResendOTP} disabled={!canResend}>
                <Text
                  className="font-body text-xs"
                  style={{ color: canResend ? theme.text.link : theme.text.disabled }}
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
