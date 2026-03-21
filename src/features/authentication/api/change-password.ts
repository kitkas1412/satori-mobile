import { api } from "@/lib/axios";
import type {
  ChangePasswordParams,
  ChangePasswordResponse,
} from "./auth.types";

/**
 * Đổi mật khẩu cho người dùng đang đăng nhập.
 * Yêu cầu nhập mật khẩu hiện tại để xác nhận danh tính.
 * Nếu `logoutOtherDevices: true`, server sẽ hủy tất cả phiên khác.
 */
export async function changePasswordApi(
  params: ChangePasswordParams,
): Promise<ChangePasswordResponse> {
  const response = await api.post<ChangePasswordResponse>(
    "/auth/change-password",
    params,
  );
  return response.data;
}
