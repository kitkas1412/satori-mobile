import { BackButton } from "@/features/authentication/components";
import { OTPInput } from "@/features/authentication/components/otp-input";
import { useResendOTP, useVerifyOTP } from "@/features/authentication/hooks";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ResetPasswordOTPScreenProps {
  email?: string;
}

export function ResetPasswordOTPScreen({
  email = "email@example.com",
}: ResetPasswordOTPScreenProps) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const { mutate: verifyOTP, isPending } = useVerifyOTP();
  const { mutate: resendOTP, isPending: isResendPending } = useResendOTP();

  const handleOTPComplete = (completedOTP: string) => {
    console.log("OTP completed:", completedOTP);
  };

  const handleResendOTP = () => {
    resendOTP(
      { email },
      {
        onSuccess: (data) => {
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#F6F7F9]"
      keyboardVerticalOffset={0}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-col px-4 pt-16 pb-4">
          {/* Back Button */}
          <BackButton onPress={() => router.back()} />

          {/* Title */}
          <Text className="font-heading text-[17px] leading-[22px] text-black mt-14 text-center">
            Thay đổi mật khẩu
          </Text>

          {/* Description */}
          <Text className="font-body text-[12px] text-black mt-7">
            Một email chứa OTP đặt lại mật khẩu đã được gửi đến địa chỉ email
            của bạn:
          </Text>

          {/* Email Display */}
          <Text className="font-heading text-[12px] text-[#F3AB1B] mt-3">
            {email}
          </Text>

          {/* OTP Input Section */}
          <View className="mt-9">
            <Text className="font-heading text-[17px] leading-[22px] text-black mb-3">
              Nhập mã OTP
            </Text>

            <OTPInput
              length={6}
              value={otp}
              onChangeText={setOtp}
              onComplete={handleOTPComplete}
            />

            {/* Resend Link */}
            <View className="flex-row items-center justify-center mt-3">
              <Text className="font-body text-[12px] text-[#6B7280]">
                Không nhận được mã?{" "}
              </Text>
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={isResendPending}
              >
                <Text className="font-body text-[12px] text-[#7B92EF]">
                  {isResendPending ? "Đang gửi..." : "Gửi lại"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button - Fixed at bottom */}
      <View className="px-4 pb-4">
        <TouchableOpacity
          className={`rounded-lg px-[14px] py-[16.5px] items-center flex-row justify-center ${
            isButtonDisabled ? "bg-gray-400" : "bg-[#7B92EF]"
          }`}
          onPress={handleContinue}
          disabled={isButtonDisabled}
          activeOpacity={0.8}
        >
          {isPending ? (
            <ActivityIndicator color="#F3F4F6" />
          ) : (
            <Text className="font-heading text-[18px] text-[#F3F4F6]">
              Tiếp tục
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
