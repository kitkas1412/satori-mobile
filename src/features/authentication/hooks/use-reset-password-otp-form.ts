import { useEffect, useState } from "react";
import { useResendOTP } from "./use-resend-otp";
import { useVerifyOTP } from "./use-verify-otp";

export function useResetPasswordOTPForm(
  email: string,
  onSuccess: (resetToken: string) => void,
) {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [verifyError, setVerifyError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");
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
          setCountdown(60);
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

  const isButtonDisabled = otp.length !== 6 || isPending;
  const canResend = countdown === 0 && !isResendPending;

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
