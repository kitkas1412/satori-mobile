import { useVerifyOTP } from "@/features/authentication/hooks/use-verify-otp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import React from "react";

import { verifyOTPApi } from "@/features/authentication/api";

jest.mock("@/features/authentication/api", () => ({
  verifyOTPApi: jest.fn(),
}));

const mockVerifyOTPApi = verifyOTPApi as jest.MockedFunction<
  typeof verifyOTPApi
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

describe("useVerifyOTP", () => {
  it("starts in idle state", () => {
    const { result } = renderHook(() => useVerifyOTP(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it("calls verifyOTPApi with email and otp on success", async () => {
    const mockResponse = {
      success: true,
      code: "SUCCESS",
      message: "OTP verified",
      data: {
        resetToken: "reset-token-abc",
        expiresInSeconds: 300,
        email: "learner1@test.satori.com",
      },
      timestamp: new Date().toISOString(),
    };
    mockVerifyOTPApi.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useVerifyOTP(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        email: "learner1@test.satori.com",
        otp: "123456",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Direct-ref mutationFn — TanStack Query v5 passes a second context arg
    expect(mockVerifyOTPApi).toHaveBeenCalledWith(
      { email: "learner1@test.satori.com", otp: "123456" },
      expect.anything(),
    );
  });

  it("exposes the resetToken from the response data", async () => {
    const mockResponse = {
      success: true,
      code: "SUCCESS",
      message: "OTP verified",
      data: {
        resetToken: "reset-token-abc",
        expiresInSeconds: 300,
        email: "learner1@test.satori.com",
      },
      timestamp: new Date().toISOString(),
    };
    mockVerifyOTPApi.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useVerifyOTP(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        email: "learner1@test.satori.com",
        otp: "123456",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data.resetToken).toBe("reset-token-abc");
  });

  it("sets isError when the API call fails", async () => {
    mockVerifyOTPApi.mockRejectedValueOnce(new Error("Invalid OTP"));

    const { result } = renderHook(() => useVerifyOTP(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate({
        email: "learner1@test.satori.com",
        otp: "000000",
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
