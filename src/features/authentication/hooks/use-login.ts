import { loginApi } from "@/features/authentication/api";
import { useAuthStore } from "@/stores";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      if (response.data.user.role !== "LEARNER") {
        throw new Error(
          "Tài khoản của bạn không có quyền truy cập ứng dụng này.",
        );
      }
      login(
        response.data.user,
        response.data.accessToken,
        response.data.refreshToken,
      );
      console.log("Login successful - Tokens saved:");
    },
  });
}
