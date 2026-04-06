import type { ChangePasswordRequest } from "@/features/authentication/api";
import { changePasswordApi } from "@/features/authentication/api";
import { useMutation } from "@tanstack/react-query";

/**
 * Hook đổi mật khẩu cho người dùng đang đăng nhập.
 * Yêu cầu nhập mật khẩu hiện tại. Sau khi thành công, người dùng sẽ bị đăng xuất.
 * Xử lý alert và logout được thực hiện tại `useChangePasswordForm`.
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (params: ChangePasswordRequest) => changePasswordApi(params),
  });
}
