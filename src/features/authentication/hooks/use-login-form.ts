import { useEffect, useRef, useState } from "react";
import { Keyboard, TextInput } from "react-native";
import { validateEmail } from "../utils";
import { useLogin } from "./use-login";

/**
 * Hook quản lý toàn bộ logic của form đăng nhập:
 * state input, validation real-time, xử lý lỗi và submit.
 *
 * Tách biệt khỏi component UI để dễ test và tái sử dụng.
 */
export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");   // Lỗi validation email (format)
  const [loginError, setLoginError] = useState("");   // Lỗi từ API (sai mật khẩu, v.v.)
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const loginMutation = useLogin();

  // Ẩn bàn phím ngay khi bắt đầu gọi API để tránh UI bị đẩy lên
  useEffect(() => {
    if (loginMutation.isPending) {
      Keyboard.dismiss();
    }
  }, [loginMutation.isPending]);

  // Xóa lỗi khi user bắt đầu sửa email
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError && text.trim()) {
      setEmailError("");
    }
    if (loginError) {
      setLoginError("");
    }
  };

  // Validate email khi user rời khỏi ô input
  const handleEmailBlur = () => {
    if (email.trim() && !validateEmail(email.trim())) {
      setEmailError("Hãy nhập email hợp lệ");
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (loginError) {
      setLoginError("");
    }
  };

  const handleSubmit = async () => {
    try {
      await loginMutation.mutateAsync({
        email: email.trim(),
        password: password.trim(),
      });
    } catch (error: any) {
      console.error("Login error:", error);
      // Ưu tiên lấy message từ response API, fallback về message lỗi JS
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      setLoginError(errorMessage);
    }
  };

  // Nút Submit chỉ được bật khi email và password đều hợp lệ
  const isFormValid =
    email.trim() &&
    password.trim() &&
    !emailError &&
    validateEmail(email.trim());

  return {
    email,
    password,
    emailError,
    loginError,
    emailInputRef,
    passwordInputRef,
    isLoading: loginMutation.isPending,
    isFormValid,
    handleEmailChange,
    handleEmailBlur,
    handlePasswordChange,
    handleSubmit,
  };
}
