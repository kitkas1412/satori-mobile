import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogout } from '@/features/authentication/hooks/use-logout';
import { useAuthStore } from '@/stores/auth-store';

jest.mock('@/features/authentication/api', () => ({
  logoutApi: jest.fn(),
}));

import { logoutApi } from '@/features/authentication/api';

const mockLogoutApi = logoutApi as jest.MockedFunction<typeof logoutApi>;

const mockUser = {
  id: '1',
  email: 'test@example.com',
  fullName: 'Test User',
  avatarUrl: null,
  role: 'student',
};

const logoutSuccess = {
  success: true,
  code: 'SUCCESS',
  message: 'Logged out',
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

describe('useLogout', () => {
  it('skips the API call when no token is in the store', async () => {
    // Store starts with token: null from getInitialState()
    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockLogoutApi).not.toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('calls logoutApi and clears store on API success', async () => {
    useAuthStore.setState({
      token: 'valid-token',
      user: mockUser,
      isAuthenticated: true,
      refreshToken: 'rt',
    });
    mockLogoutApi.mockResolvedValueOnce(logoutSuccess);

    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockLogoutApi).toHaveBeenCalled();
    const { isAuthenticated, token, user } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(token).toBeNull();
    expect(user).toBeNull();
  });

  it('swallows a 401 error and still clears store via onSuccess', async () => {
    useAuthStore.setState({ token: 'expired-token', isAuthenticated: true });
    const error401 = Object.assign(new Error('Unauthorized'), {
      response: { status: 401 },
    });
    mockLogoutApi.mockRejectedValueOnce(error401);

    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate();
    });

    // 401 is swallowed inside mutationFn → treated as success
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('clears store on non-401 API error (local-first guarantee)', async () => {
    useAuthStore.setState({ token: 'valid-token', isAuthenticated: true });
    const networkError = new Error('Network Error'); // no response.status
    mockLogoutApi.mockRejectedValueOnce(networkError);

    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    // onError still clears the store
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
  });
});
