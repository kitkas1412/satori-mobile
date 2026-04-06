import { useMutation } from "@tanstack/react-query";
import { registerDeviceTokenApi } from "@/features/notification/api";
import type { RegisterDeviceTokenRequest } from "@/features/notification/api";

export function useRegisterDeviceToken() {
  return useMutation({
    mutationFn: (params: RegisterDeviceTokenRequest) =>
      registerDeviceTokenApi(params),
  });
}
