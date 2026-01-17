import { api } from "@/lib/axios";
import { useAuthStore } from "@/stores";
import type { ApiResponse, User } from "@/types/api";
import { useMutation } from "@tanstack/react-query";

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

export function useLogin() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (params: LoginParams) => {
      const response = await api.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        params,
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Lưu user và token vào store
      login(data.user, data.token);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      // Clear user và token
      logout();
    },
  });
}

interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export function useRegister() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (params: RegisterParams) => {
      const response = await api.post<ApiResponse<LoginResponse>>(
        "/auth/register",
        params,
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Tự động login sau khi đăng ký
      login(data.user, data.token);
    },
  });
}
