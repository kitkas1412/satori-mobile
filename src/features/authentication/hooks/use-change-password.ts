import type { ChangePasswordParams } from "@/features/authentication/api";
import { changePasswordApi } from "@/features/authentication/api";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";

export function useChangePassword() {
  return useMutation({
    mutationFn: (params: ChangePasswordParams) => changePasswordApi(params),
    onSuccess: (data) => {
      Alert.alert("Thành công", data.message || "Đổi mật khẩu thành công");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra khi đổi mật khẩu";
      Alert.alert("Lỗi", errorMessage);
    },
  });
}
