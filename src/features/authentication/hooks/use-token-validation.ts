import { validateTokenApi } from "@/features/authentication/api";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";

/**
 * Hook kiểm tra tính hợp lệ của token khi khởi động app.
 *
 * Chạy một lần duy nhất sau khi store được load từ SecureStore (`isHydrated`).
 * Chỉ kiểm tra nếu user đang được coi là đã đăng nhập (`isAuthenticated`).
 *
 * Xử lý lỗi:
 * - Lỗi 401 (token hết hạn): axios interceptor tự động thử refresh token.
 *   Nếu refresh thất bại, interceptor gọi logout() — không cần xử lý ở đây.
 * - Lỗi mạng hoặc lỗi khác: giữ nguyên trạng thái đăng nhập (Approach A —
 *   không ép logout khi mất mạng tạm thời).
 *
 * `isValidating` được dùng bởi auth guard trong _layout.tsx để trì hoãn
 * redirect cho đến khi quá trình kiểm tra token hoàn tất.
 */
export function useTokenValidation() {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // Chờ store load xong từ SecureStore trước khi kiểm tra
    if (!isHydrated) return;
    // Không có gì để kiểm tra nếu user chưa đăng nhập
    if (!isAuthenticated) return;

    setIsValidating(true);
    validateTokenApi()
      .catch(() => {
        // 401: axios interceptor tự động gọi logout()
        // Lỗi mạng hoặc lỗi khác: giữ nguyên trạng thái đăng nhập (approach A)
      })
      .finally(() => {
        setIsValidating(false);
      });
  }, [isHydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isValidating };
}
