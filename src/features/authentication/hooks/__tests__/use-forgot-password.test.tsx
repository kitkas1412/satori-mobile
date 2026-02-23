import { useForgotPassword } from "@/features/authentication/hooks/use-forgot-password";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import React from "react";

import { forgotPasswordApi } from "@/features/authentication/api";

jest.mock("@/features/authentication/api", () => ({
  forgotPasswordApi: jest.fn(),
}));

const mockForgotPasswordApi = forgotPasswordApi as jest.MockedFunction<
  typeof forgotPasswordApi
>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useForgotPassword", () => {
  it("starts in idle state", () => {
    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it("calls forgotPasswordApi with the provided email on success", async () => {
    mockForgotPasswordApi.mockResolvedValueOnce({
      success: true,
      code: "SUCCESS",
      message: "OTP sent",
      timestamp: new Date().toISOString(),
    });

    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ email: "learner1@test.satori.com" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Direct-ref mutationFn — TanStack Query v5 passes a second context arg
    expect(mockForgotPasswordApi).toHaveBeenCalledWith(
      { email: "learner1@test.satori.com" },
      expect.anything(),
    );
  });

  it("sets isError when the API call fails", async () => {
    mockForgotPasswordApi.mockRejectedValueOnce(new Error("Email not found"));

    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({ email: "unknown@example.com" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
