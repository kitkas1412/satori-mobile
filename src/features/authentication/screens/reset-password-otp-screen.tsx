import { PrimaryButton } from "@/components/ui";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useResendOTP, useVerifyOTP } from "@/features/authentication/hooks";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { mutate: verifyOTP, isPending } = useVerifyOTP();
  const { mutate: resendOTP, isPending: isResendPending } = useResendOTP();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOTPComplete = (completedOTP: string) => {
    console.log("OTP completed:", completedOTP);
  };

  const handleResendOTP = () => {
    resendOTP(
      { email },
      {
        onSuccess: (data) => {
          setCountdown(60);
          Alert.alert(
            "Đã gửi lại mã",
            data.message || "Một mã OTP mới đã được gửi đến email của bạn",
          );
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra khi gửi lại OTP";
          Alert.alert("Lỗi", errorMessage);
        },
      },
    );
  };

  const handleContinue = () => {
    if (otp.length === 6) {
      verifyOTP(
        { email, otp },
        {
          onSuccess: (data) => {
            // Navigate to reset password screen with reset token
            router.push({
              pathname: "/(auth)/reset-password",
              params: {
                email,
                resetToken: data.data.resetToken,
              },
            });
          },
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.message ||
              error?.message ||
              "Có lỗi xảy ra khi xác thực OTP";
            Alert.alert("Lỗi", errorMessage);
          },
        },
      );
    }
  };

  const isButtonDisabled = otp.length !== 6 || isPending;
  const canResend = countdown === 0 && !isResendPending;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#F6F7F9]"
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

          <Text className="font-heading text-xs text-[#F3AB1B] mt-3">
            {email}
          </Text>

          <View className="mt-9">
            <Text className="font-heading text-lg text-black mb-3">
              Nhập mã OTP
            </Text>

            <OTPInput
              length={6}
              value={otp}
              onChangeText={setOtp}
              onComplete={handleOTPComplete}
              autoFocus={true}
            />

            <View className="flex-row items-center justify-center mt-3">
              <Text className="font-body text-xs text-[#6B7280]">
                Không nhận được mã?{" "}
              </Text>
              <TouchableOpacity onPress={handleResendOTP} disabled={!canResend}>
                <Text
                  className={`font-body text-xs ${canResend ? "text-[#7B92EF]" : "text-[#9CA3AF]"}`}
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
