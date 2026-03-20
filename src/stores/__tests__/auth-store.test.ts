import {
  useAuthStore,
  selectUser,
  selectToken,
  selectIsAuthenticated,
} from '@/stores/auth-store';

const mockUser = {
  id: '1',
  email: 'test@example.com',
  fullName: 'Test User',
  avatarUrl: null,
  role: 'student',
};

beforeEach(() => {
  useAuthStore.setState(useAuthStore.getInitialState());
});

describe('initial state', () => {
  it('has null user, token, and refreshToken', () => {
    const { user, token, refreshToken } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();
    expect(refreshToken).toBeNull();
  });

  it('has isAuthenticated: false', () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('has isLoading: false and isHydrated: false', () => {
    const { isLoading, isHydrated } = useAuthStore.getState();
    expect(isLoading).toBe(false);
    expect(isHydrated).toBe(false);
  });
});

describe('login', () => {
  it('sets user, token, refreshToken and isAuthenticated: true', () => {
    useAuthStore.getState().login(mockUser, 'access-token', 'refresh-token');

    const { user, token, refreshToken, isAuthenticated } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(token).toBe('access-token');
    expect(refreshToken).toBe('refresh-token');
    expect(isAuthenticated).toBe(true);
  });
});

describe('logout', () => {
  it('clears user, token, refreshToken and sets isAuthenticated: false', () => {
    useAuthStore.getState().login(mockUser, 'access-token', 'refresh-token');
    useAuthStore.getState().logout();

    const { user, token, refreshToken, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();
    expect(refreshToken).toBeNull();
    expect(isAuthenticated).toBe(false);
  });
});

describe('setUser', () => {
  it('sets user and isAuthenticated: true', () => {
    useAuthStore.getState().setUser(mockUser);

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('sets isAuthenticated: false when called with null', () => {
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setUser(null);

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});

describe('setToken', () => {
  it('sets the token', () => {
    useAuthStore.getState().setToken('my-token');
    expect(useAuthStore.getState().token).toBe('my-token');
  });

  it('can set token to null', () => {
    useAuthStore.getState().setToken('my-token');
    useAuthStore.getState().setToken(null);
    expect(useAuthStore.getState().token).toBeNull();
  });
});

describe('setRefreshToken', () => {
  it('sets the refreshToken', () => {
    useAuthStore.getState().setRefreshToken('my-refresh-token');
    expect(useAuthStore.getState().refreshToken).toBe('my-refresh-token');
  });
});

describe('setHydrated', () => {
  it('sets isHydrated: true', () => {
    useAuthStore.getState().setHydrated();
    expect(useAuthStore.getState().isHydrated).toBe(true);
  });
});

describe('updateUser', () => {
  it('merges partial updates into the existing user', () => {
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().updateUser({ fullName: 'Updated Name' });

    const user = useAuthStore.getState().user;
    expect(user?.fullName).toBe('Updated Name');
    expect(user?.email).toBe(mockUser.email);
    expect(user?.id).toBe(mockUser.id);
  });

  it('is a no-op when user is null', () => {
    useAuthStore.getState().updateUser({ fullName: 'Should Not Update' });
    expect(useAuthStore.getState().user).toBeNull();
  });
});

describe('selectors', () => {
  it('selectUser returns the current user', () => {
    useAuthStore.getState().login(mockUser, 'token', 'rt');
    expect(selectUser(useAuthStore.getState())).toEqual(mockUser);
  });

  it('selectToken returns the current token', () => {
    useAuthStore.getState().setToken('tok');
    expect(selectToken(useAuthStore.getState())).toBe('tok');
  });

  it('selectIsAuthenticated returns the isAuthenticated flag', () => {
    useAuthStore.getState().login(mockUser, 'token', 'rt');
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(true);

    useAuthStore.getState().logout();
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(false);
  });
});
