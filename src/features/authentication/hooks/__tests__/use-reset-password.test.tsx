import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useResetPassword } from '@/features/authentication/hooks/use-reset-password';

jest.mock('@/features/authentication/api', () => ({
  resetPasswordApi: jest.fn(),
}));

import { resetPasswordApi } from '@/features/authentication/api';

const mockResetPasswordApi = resetPasswordApi as jest.MockedFunction<typeof resetPasswordApi>;

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

describe('useResetPassword', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useResetPassword(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it('calls resetPasswordApi with the provided params on success', async () => {
    mockResetPasswordApi.mockResolvedValueOnce({
      success: true,
      code: 'SUCCESS',
      message: 'Password reset successfully',
      timestamp: new Date().toISOString(),
    });

    const { result } = renderHook(() => useResetPassword(), { wrapper: createWrapper() });

    const params = {
      resetToken: 'reset-token-abc',
      newPassword: 'NewPass1!',
      confirmPassword: 'NewPass1!',
    };

    await act(async () => {
      result.current.mutate(params);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Direct-ref mutationFn — TanStack Query v5 passes a second context arg
    expect(mockResetPasswordApi).toHaveBeenCalledWith(params, expect.anything());
  });

  it('sets isError when the API call fails', async () => {
    mockResetPasswordApi.mockRejectedValueOnce(new Error('Invalid or expired token'));

    const { result } = renderHook(() => useResetPassword(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({
        resetToken: 'bad-token',
        newPassword: 'NewPass1!',
        confirmPassword: 'NewPass1!',
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
