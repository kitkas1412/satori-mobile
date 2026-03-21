import { useEffect, useState } from "react";
import { useResendOTP } from "./use-resend-otp";
import { useVerifyOTP } from "./use-verify-otp";

/**
 * Hook quản lý form nhập mã OTP để đặt lại mật khẩu.
 *
 * @param email Email đã được gửi OTP, dùng khi xác thực và gửi lại OTP.
 * @param onSuccess Callback nhận `resetToken` khi OTP hợp lệ,
 *                  dùng để điều hướng sang màn hình đặt mật khẩu mới.
 */
export function useResetPasswordOTPForm(
  email: string,
  onSuccess: (resetToken: string) => void,
) {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);      // Đếm ngược (giây) trước khi cho phép gửi lại OTP
  const [verifyError, setVerifyError] = useState("");  // Lỗi khi xác thực OTP sai
  const [resendMessage, setResendMessage] = useState(""); // Thông báo gửi lại OTP thành công
  const [resendError, setResendError] = useState("");     // Lỗi khi gửi lại OTP thất bại
  const { mutate: verifyOTP, isPending } = useVerifyOTP();
  const { mutate: resendOTP, isPending: isResendPending } = useResendOTP();

  // Đồng hồ đếm ngược mỗi giây, tự dừng khi countdown về 0
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOTPChange = (text: string) => {
    setOtp(text);
    if (verifyError) {
      setVerifyError("");
    }
  };

  const handleResendOTP = () => {
    setResendError("");
    setResendMessage("");
    resendOTP(
      { email },
      {
        onSuccess: (data) => {
          setCountdown(60); // Khóa nút "Gửi lại" trong 60 giây sau mỗi lần gửi
          setResendMessage(
            data.message || "Một mã OTP mới đã được gửi đến email của bạn",
          );
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra khi gửi lại OTP";
          setResendError(errorMessage);
        },
      },
    );
  };

  const handleContinue = () => {
    if (otp.length !== 6) return;

    verifyOTP(
      { email, otp },
      {
        onSuccess: (data) => {
          onSuccess(data.data.resetToken);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra khi xác thực OTP";
          setVerifyError(errorMessage);
        },
      },
    );
  };

  const isButtonDisabled = otp.length !== 6 || isPending; // Chỉ cho submit khi đủ 6 chữ số
  const canResend = countdown === 0 && !isResendPending;  // Chỉ cho gửi lại khi countdown xong và không đang pending

  return {
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
  };
}
