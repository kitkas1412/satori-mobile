import { api } from "@/lib/axios";
import type { ApiResponse, UserProfile } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const profileQueryKey = ["profile"] as const;

export function useProfile() {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: async () => {
      const response = await api.get<ApiResponse<UserProfile>>("/profile");
      return response.data.data;
    },
  });
}
