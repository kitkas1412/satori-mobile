import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useChangePassword } from '@/features/authentication/hooks/use-change-password';

jest.mock('@/features/authentication/api', () => ({
  changePasswordApi: jest.fn(),
}));

import { changePasswordApi } from '@/features/authentication/api';

const mockChangePasswordApi = changePasswordApi as jest.MockedFunction<typeof changePasswordApi>;

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

describe('useChangePassword', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useChangePassword(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it('calls changePasswordApi with the provided params on success', async () => {
    mockChangePasswordApi.mockResolvedValueOnce({
      success: true,
      code: 'SUCCESS',
      message: 'Password changed',
      data: null,
    });

    const { result } = renderHook(() => useChangePassword(), { wrapper: createWrapper() });

    const params = {
      currentPassword: 'OldPass1!',
      newPassword: 'NewPass1!',
      confirmPassword: 'NewPass1!',
    };

    await act(async () => {
      result.current.mutate(params);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Inline wrapper mutationFn: (params) => changePasswordApi(params)
    // TanStack Query does NOT pass the context as a 2nd arg to changePasswordApi
    expect(mockChangePasswordApi).toHaveBeenCalledWith(params);
    expect(mockChangePasswordApi).toHaveBeenCalledTimes(1);
  });

  it('sets isError when the API call fails', async () => {
    mockChangePasswordApi.mockRejectedValueOnce(new Error('Incorrect current password'));

    const { result } = renderHook(() => useChangePassword(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({
        currentPassword: 'wrong',
        newPassword: 'NewPass1!',
        confirmPassword: 'NewPass1!',
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
