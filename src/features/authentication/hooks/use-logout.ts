import { logoutApi } from "@/features/authentication/api";
import { useAuthStore } from "@/stores";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: async () => {
      // Không có token → bỏ qua API call (đã đăng xuất hoặc token hết hạn)
      if (!token) {
        console.log("Không tìm thấy token, bỏ qua API đăng xuất");
        return { success: true, message: "Already logged out" };
      }

      try {
        return await logoutApi();
      } catch (error: any) {
        // Nếu 401, token đã hết hạn → tiếp tục dọn dẹp local
        if (error?.response?.status === 401) {
          console.log(
            "Token hết hạn khi đăng xuất, tiến hành dọn dẹp local",
          );
          return { success: true, message: "Token expired" };
        }
        throw error;
      }
    },
    onSuccess: () => {
      // Xóa auth store (kích hoạt dọn dẹp SecureStore qua persist middleware)
      logout();

      // Điều hướng và dọn React Query cache được xử lý tự động bởi
      // auth guard trong _layout.tsx khi isAuthenticated chuyển false
    },
    onError: (error: any) => {
      // BR-68: Vẫn đăng xuất local dù API thất bại (offline hoặc timeout)
      logout();
    },
  });
}
