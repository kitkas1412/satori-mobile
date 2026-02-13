import { logoutApi } from "@/features/authentication/api";
import { useAuthStore } from "@/stores";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // If no token, skip API call (already logged out or expired)
      if (!token) {
        console.log("No token found, skipping logout API call");
        return { success: true, message: "Already logged out" };
      }

      try {
        return await logoutApi();
      } catch (error: any) {
        // If 401, token already expired - continue with local cleanup
        if (error?.response?.status === 401) {
          console.log(
            "Token expired during logout, proceeding with local cleanup",
          );
          return { success: true, message: "Token expired" };
        }
        throw error;
      }
    },
    onSuccess: () => {
      // Clear all React Query cache
      queryClient.clear();

      // Clear auth store (triggers SecureStore cleanup via persist middleware)
      logout();

      // Navigation handled automatically by _layout.tsx auth guard
    },
    onError: (error: any) => {
      // BR-68: Still logout locally even if API fails (offline or timeout)
      console.error(
        "Logout API failed, proceeding with local cleanup:",
        error?.message,
      );

      queryClient.clear();
      logout();

      // Auth guard in _layout.tsx will handle navigation to login screen
    },
  });
}
