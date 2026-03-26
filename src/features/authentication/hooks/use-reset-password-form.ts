import { useRef, useState } from "react";
import { TextInput } from "react-native";
import { useResetPassword } from "./use-reset-password";

/**
 * Hook quản lý form đặt mật khẩu mới.
 * @param resetToken Token tạm thời nhận được sau khi xác thực OTP thành công.
 * @param onSuccess Callback điều hướng sang màn hình thông báo đặt lại thành công.
 */
export function useResetPasswordForm(
  resetToken: string,
  onSuccess: () => void,
) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitError, setSubmitError] = useState(""); // Lỗi từ API hoặc thiếu token
  const confirmPasswordRef = useRef<TextInput>(null);

  const { mutate: resetPassword, isPending } = useResetPassword();

  const handleSubmit = () => {
    if (!isFormValid) return;

    if (!resetToken) {
      setSubmitError("Thông tin đặt lại mật khẩu không hợp lệ");
      return;
    }

    resetPassword(
      { resetToken, newPassword, confirmPassword },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra khi đặt lại mật khẩu";
          setSubmitError(errorMessage);
        },
      },
    );
  };

  // Mật khẩu hợp lệ: tối thiểu 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt, và 2 ô khớp nhau
  const isFormValid =
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[a-z]/.test(newPassword) &&
    /[0-9]/.test(newPassword) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) &&
    newPassword === confirmPassword;

  const passwordsDontMatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  return {
    newPassword,
    confirmPassword,
    submitError,
    confirmPasswordRef,
    isFormValid,
    passwordsDontMatch,
    isLoading: isPending,
    setNewPassword,
    setConfirmPassword,
    handleSubmit,
  };
}
