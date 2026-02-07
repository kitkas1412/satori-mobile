import { loginApi } from "@/features/authentication/api";
import { useAuthStore } from "@/stores";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      login(response.data.user, response.data.accessToken);
      console.log("Login successful - Token saved:");
    },
  });
}
