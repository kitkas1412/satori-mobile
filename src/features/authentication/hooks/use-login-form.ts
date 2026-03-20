import { useEffect, useRef, useState } from "react";
import { Keyboard, TextInput } from "react-native";
import { validateEmail } from "../utils";
import { useLogin } from "./use-login";

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const loginMutation = useLogin();

  useEffect(() => {
    if (loginMutation.isPending) {
      Keyboard.dismiss();
    }
  }, [loginMutation.isPending]);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError && text.trim()) {
      setEmailError("");
    }
    if (loginError) {
      setLoginError("");
    }
  };

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
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      setLoginError(errorMessage);
    }
  };

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
