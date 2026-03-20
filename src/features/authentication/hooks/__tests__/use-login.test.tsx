import { useLogin } from "@/features/authentication/hooks/use-login";
import { useAuthStore } from "@/stores/auth-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import React from "react";

import { loginApi } from "@/features/authentication/api";

jest.mock("@/features/authentication/api", () => ({
  loginApi: jest.fn(),
}));

const mockLoginApi = loginApi as jest.MockedFunction<typeof loginApi>;

const mockUser = {
  id: "a0000000-0000-0000-0000-000000000004",
  email: "learner1@test.satori.com",
  fullName: "Nguyen Van A",
  avatarUrl: null,
  role: "LEARNER",
};

const mockLoginResponse = {
  success: true,
  code: "SUCCESS",
  message: "Login successful",
  data: {
    accessToken: "access-token",
    refreshToken: "refresh-token",
    tokenType: "Bearer",
    expiresIn: 3600,
    user: mockUser,
  },
  timestamp: new Date().toISOString(),
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

beforeEach(() => {
  useAuthStore.setState(useAuthStore.getInitialState());
  jest.clearAllMocks();
});

describe("useLogin", () => {
  it("starts in idle state", () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("calls loginApi with provided params on success", async () => {
    mockLoginApi.mockResolvedValueOnce(mockLoginResponse);
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        email: "learner1@test.satori.com",
        password: "Password123!",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Direct-ref mutationFn — TanStack Query v5 passes a second context arg
    expect(mockLoginApi).toHaveBeenCalledWith(
      { email: "learner1@test.satori.com", password: "Password123!" },
      expect.anything(),
    );
  });

  it("stores user, token and refreshToken in auth store on success", async () => {
    mockLoginApi.mockResolvedValueOnce(mockLoginResponse);
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        email: "learner1@test.satori.com",
        password: "Password123!",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { user, token, refreshToken, isAuthenticated } =
      useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(token).toBe("access-token");
    expect(refreshToken).toBe("refresh-token");
    expect(isAuthenticated).toBe(true);
  });

  it("sets isError and does not update store on failure", async () => {
    mockLoginApi.mockRejectedValueOnce(new Error("Invalid credentials"));
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        email: "learner1@test.satori.com",
        password: "wrong",
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    const { isAuthenticated, user } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
  });

  it("rejects login and does not update store when role is not learner", async () => {
    const nonLearnerResponse = {
      ...mockLoginResponse,
      data: {
        ...mockLoginResponse.data,
        user: { ...mockUser, role: "TEACHER" },
      },
    };
    mockLoginApi.mockResolvedValueOnce(nonLearnerResponse);
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        email: "teacher@test.satori.com",
        password: "Password123!",
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    const { isAuthenticated, user } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
  });

  it("exposes the role-restriction error message when role is not learner", async () => {
    const nonLearnerResponse = {
      ...mockLoginResponse,
      data: {
        ...mockLoginResponse.data,
        user: { ...mockUser, role: "ADMIN" },
      },
    };
    mockLoginApi.mockResolvedValueOnce(nonLearnerResponse);
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        email: "admin@test.satori.com",
        password: "Password123!",
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe(
      "Tài khoản của bạn không có quyền truy cập ứng dụng này.",
    );
  });
});
