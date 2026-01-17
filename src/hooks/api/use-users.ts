import { api } from "@/lib/axios";
import type { ApiResponse, User } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys - nên tổ chức theo feature
export const queryKeys = {
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters: string) =>
      [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  auth: {
    me: ["auth", "me"] as const,
  },
};

// ============================================
// User Queries
// ============================================

// Get current user
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const response = await api.get<ApiResponse<User>>("/users/me");
      return response.data.data;
    },
  });
}

// Get user by ID
export function useUser(userId: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: async () => {
      const response = await api.get<ApiResponse<User>>(`/users/${userId}`);
      return response.data.data;
    },
    enabled: !!userId, // Chỉ fetch khi có userId
  });
}

// Get users list
export function useUsers(filters?: string) {
  return useQuery({
    queryKey: queryKeys.users.list(filters || ""),
    queryFn: async () => {
      const response = await api.get<ApiResponse<User[]>>("/users", {
        params: { filters },
      });
      return response.data.data;
    },
  });
}

// ============================================
// User Mutations
// ============================================

interface UpdateUserParams {
  userId: string;
  data: Partial<User>;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: UpdateUserParams) => {
      const response = await api.put<ApiResponse<User>>(
        `/users/${userId}`,
        data,
      );
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });

      // Hoặc update trực tiếp cache (optimistic update)
      queryClient.setQueryData(queryKeys.users.detail(variables.userId), data);
    },
  });
}

interface CreateUserParams {
  name: string;
  email: string;
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserParams) => {
      const response = await api.post<ApiResponse<User>>("/users", data);
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/users/${userId}`);
    },
    onSuccess: (_, userId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.users.detail(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
  });
}
