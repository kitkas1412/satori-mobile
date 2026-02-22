import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin } from '@/features/authentication/hooks/use-login';
import { useAuthStore } from '@/stores/auth-store';

jest.mock('@/features/authentication/api', () => ({
  loginApi: jest.fn(),
}));

import { loginApi } from '@/features/authentication/api';

const mockLoginApi = loginApi as jest.MockedFunction<typeof loginApi>;

const mockUser = {
  id: '1',
  email: 'test@example.com',
  fullName: 'Test User',
  avatarUrl: null,
  role: 'student',
};

const mockLoginResponse = {
  success: true,
  code: 'SUCCESS',
  message: 'Login successful',
  data: {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    tokenType: 'Bearer',
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

describe('useLogin', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('calls loginApi with provided params on success', async () => {
    mockLoginApi.mockResolvedValueOnce(mockLoginResponse);
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ email: 'test@example.com', password: 'Password1!' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Direct-ref mutationFn — TanStack Query v5 passes a second context arg
    expect(mockLoginApi).toHaveBeenCalledWith(
      { email: 'test@example.com', password: 'Password1!' },
      expect.anything(),
    );
  });

  it('stores user, token and refreshToken in auth store on success', async () => {
    mockLoginApi.mockResolvedValueOnce(mockLoginResponse);
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ email: 'test@example.com', password: 'Password1!' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { user, token, refreshToken, isAuthenticated } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(token).toBe('access-token');
    expect(refreshToken).toBe('refresh-token');
    expect(isAuthenticated).toBe(true);
  });

  it('sets isError and does not update store on failure', async () => {
    mockLoginApi.mockRejectedValueOnce(new Error('Invalid credentials'));
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ email: 'bad@example.com', password: 'wrong' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    const { isAuthenticated, user } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
  });
});
