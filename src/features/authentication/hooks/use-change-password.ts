import type { ChangePasswordParams } from "@/features/authentication/api";
import { changePasswordApi } from "@/features/authentication/api";
import { useMutation } from "@tanstack/react-query";

export function useChangePassword() {
  return useMutation({
    mutationFn: (params: ChangePasswordParams) => changePasswordApi(params),
  });
}
