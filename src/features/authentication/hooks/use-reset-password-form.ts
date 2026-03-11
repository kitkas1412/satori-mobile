import { useRef, useState } from "react";
import { TextInput } from "react-native";
import { useResetPassword } from "./use-reset-password";

export function useResetPasswordForm(
  resetToken: string,
  onSuccess: () => void,
) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitError, setSubmitError] = useState("");
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
