import { loginApi } from "@/features/authentication/api";
import { useAuthStore } from "@/stores";
import { useMutation } from "@tanstack/react-query";

/**
 * Hook xử lý đăng nhập người dùng.
 *
 * Sau khi API trả về thành công:
 * 1. Kiểm tra role — chỉ tài khoản LEARNER mới được dùng app này.
 * 2. Lưu user, accessToken và refreshToken vào auth store (SecureStore).
 * 3. Navigation về màn hình chính được xử lý tự động bởi auth guard trong _layout.tsx.
 */
export function useLogin() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      // Chặn các tài khoản không phải học viên (admin, teacher, v.v.)
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
