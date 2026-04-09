import { api } from "@/lib/axios";
import type { ApiResponse, UserProfile } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

interface UpdateProfileParams {
  displayName?: string;
  gender?: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateProfileParams) => {
      const cached = queryClient.getQueryData<UserProfile>(profileQueryKey);
      const response = await api.put<ApiResponse<UserProfile>>("/profile", {
        email: cached?.email,
        ...data,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey });
    },
  });
}
