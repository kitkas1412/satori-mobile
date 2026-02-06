import { registerApi } from "@/features/authentication/api";
import { useAuthStore } from "@/stores";
import { useMutation } from "@tanstack/react-query";

export function useRegister() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      login(data.user, data.token);
    },
  });
}
