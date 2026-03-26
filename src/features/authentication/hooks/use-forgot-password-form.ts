import { validateEmail } from "@/features/authentication/utils";
import { useRef, useState } from "react";
import { TextInput } from "react-native";
import { useForgotPassword } from "./use-forgot-password";

/**
 * Hook quản lý form nhập email để lấy lại mật khẩu.
 * @param onSuccess Callback nhận email khi gửi yêu cầu thành công,
 *                  dùng để điều hướng sang màn hình nhập OTP.
 */
export function useForgotPasswordForm(onSuccess: (email: string) => void) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");    // Lỗi format email
  const [submitError, setSubmitError] = useState("");  // Lỗi từ API
  const emailInputRef = useRef<TextInput>(null);
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError && text.trim()) {
      setEmailError("");
    }
    if (submitError) {
      setSubmitError("");
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
        onSuccess: () => {
          onSuccess(email);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra khi gửi email khôi phục mật khẩu";
          setSubmitError(errorMessage);
        },
      },
    );
  };

  const isFormValid = !!email && !emailError && validateEmail(email.trim());

  return {
    email,
    emailError,
    submitError,
    emailInputRef,
    isFormValid,
    isLoading: isPending,
    handleEmailChange,
    handleEmailBlur,
    handleSubmit,
  };
}
