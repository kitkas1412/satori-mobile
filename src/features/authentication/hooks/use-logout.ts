import { logoutApi } from "@/features/authentication/api";
import { useAuthStore } from "@/stores";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

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
      // Xóa toàn bộ cache của React Query
      queryClient.clear();

      // Xóa auth store (kích hoạt dọn dẹp SecureStore qua persist middleware)
      logout();

      // Điều hướng được xử lý tự động bởi auth guard trong _layout.tsx
    },
    onError: (error: any) => {
      // BR-68: Vẫn đăng xuất local dù API thất bại (offline hoặc timeout)
      console.error(
        "API đăng xuất thất bại, tiến hành dọn dẹp local:",
        error?.message,
      );

      queryClient.clear();
      logout();

      // Auth guard trong _layout.tsx sẽ xử lý điều hướng về màn hình đăng nhập
    },
  });
}
