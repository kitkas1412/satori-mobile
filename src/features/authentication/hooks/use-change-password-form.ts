import { useAuthStore } from "@/stores/auth-store";
import { useRef, useState } from "react";
import { Alert, TextInput } from "react-native";
import { useChangePassword } from "./use-change-password";

export function useChangePasswordForm(onSuccess: () => void) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const { logout } = useAuthStore();
  const { mutate: changePassword, isPending } = useChangePassword();

  const handleCurrentPasswordChange = (text: string) => {
    setCurrentPassword(text);
    if (currentPasswordError) {
      setCurrentPasswordError("");
    }
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    changePassword(
      {
        currentPassword,
        newPassword,
        confirmPassword,
        logoutOtherDevices: true,
      },
      {
        onSuccess: () => {
          Alert.alert(
            "Thành công",
            "Vui lòng đăng nhập lại với mật khẩu mới.",
            [
              {
                text: "OK",
                onPress: () => {
                  logout();
                  onSuccess();
                },
              },
            ],
          );
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra khi đổi mật khẩu";

          if (
            errorMessage.toLowerCase().includes("mật khẩu hiện tại") ||
            errorMessage.toLowerCase().includes("incorrect password") ||
            errorMessage.toLowerCase().includes("wrong password") ||
            errorMessage.toLowerCase().includes("current password")
          ) {
            setCurrentPasswordError(errorMessage);
          } else {
            Alert.alert("Lỗi", errorMessage);
          }
        },
      },
    );
  };

  const isFormValid =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[a-z]/.test(newPassword) &&
    /[0-9]/.test(newPassword) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) &&
    newPassword === confirmPassword &&
    newPassword !== currentPassword;

  const passwordsDontMatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const newPasswordSameAsOld =
    newPassword.length > 0 &&
    currentPassword.length > 0 &&
    newPassword === currentPassword;

  return {
    currentPassword,
    newPassword,
    confirmPassword,
    currentPasswordError,
    newPasswordRef,
    confirmPasswordRef,
    isFormValid,
    passwordsDontMatch,
    newPasswordSameAsOld,
    isLoading: isPending,
    setNewPassword,
    setConfirmPassword,
    handleCurrentPasswordChange,
    handleSubmit,
  };
}
