# API and Authentication Flow

> Part of the [System Design Ground Truth](system_design-doc.md).

---

## Axios Instance (`src/lib/axios.ts`)

Single instance only. Base URL from `EXPO_PUBLIC_API_URL`. Timeout: 30 seconds.

```ts
import { api } from "@/lib/axios";
// Available methods:
api.get<T>(url, config?)
api.post<T>(url, data?, config?)
api.put<T>(url, data?, config?)
api.patch<T>(url, data?, config?)
api.delete<T>(url, config?)
```

---

## Request Interceptor

1. Reads `token` from `useAuthStore.getState()` (not hook — safe outside React).
2. Attaches `Authorization: Bearer <token>` header if token exists.
3. Skips authorization for public endpoints: `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/refresh`.

---

## Response Interceptor

| Status        | Behavior                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------- |
| 401           | Attempts token refresh (see below). Logout only if refresh fails or no refreshToken available.    |
| 403           | Logs error, propagates rejection                                                                  |
| 404           | Logs error, propagates rejection                                                                  |
| 500           | Logs error, propagates rejection                                                                  |
| Network error | Logs "Network Error", propagates rejection                                                        |

### Token Refresh Mechanism (401 handling)

When a non-refresh request receives a 401, the interceptor follows this logic:

1. **If the failing request is `/auth/refresh` itself** → refresh token has expired → `logout()` + `queryClient.clear()` immediately.
2. **If another refresh is already in progress** → enqueue the failing request in `failedQueue`. When the ongoing refresh resolves, all queued requests are retried with the new token.
3. **If no `refreshToken` in store** → `logout()` + `queryClient.clear()` immediately.
4. **Otherwise** → call `POST /auth/refresh` with the current `refreshToken`:
   - **Success**: save new `accessToken` + `refreshToken` to store, retry the original request, resolve all queued requests.
   - **Failure**: `logout()` + `queryClient.clear()`, reject all queued requests.

The `isRefreshing` flag prevents multiple concurrent refresh calls.

---

## API Function Pattern

All API functions live in `src/features/<feature>/api/`. They are plain async functions — no hooks, no stores.

```ts
// src/features/authentication/api/login.ts
import { api } from "@/lib/axios";
import type { LoginParams, LoginResponse } from "./auth.types";

export async function loginApi(params: LoginParams): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", params);
  return data;
}
```

---

## Shared Base Types (`src/types/api.ts`)

```ts
interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

> **Note:** Feature-specific response types (e.g., `LoginResponse`, `LogoutResponse`) live in `src/features/<feature>/api/auth.types.ts`, not in `src/types/api.ts`.

---

## Authentication Flow

### Login Flow

```
User submits form
      │
      ▼
useLoginForm.handleSubmit()
      │  validates email, trims input
      ▼
loginMutation.mutateAsync({ email, password })
      │  calls loginApi → POST /auth/login
      ▼
onSuccess: authStore.login(user, accessToken, refreshToken)
      │  persists to SecureStore via zustand persist middleware
      ▼
isAuthenticated becomes true
      │
      ▼
Auth guard in _layout.tsx detects isAuthenticated && inAuthGroup
      │
      ▼
router.replace("/(tabs)")   ← navigation handled by guard, NOT the hook
```

### Logout Flow (Graceful)

```
User taps Logout
      │
      ▼
useLogout.mutate()
      │
      ├─ if no token → skip API call, go to onSuccess
      ├─ POST /auth/logout
      │    └─ if 401 → treat as success (token already expired)
      │
      ▼
onSuccess:
  queryClient.clear()          ← clears all cached server data
  authStore.logout()           ← clears SecureStore via persist
      │
      ▼
isAuthenticated becomes false
      │
      ▼
Auth guard redirects to /(auth)/welcome

onError (network/other failure):
  queryClient.clear()          ← still clear cache
  authStore.logout()           ← still logout locally
```

### Password Reset Multi-Step Flow

```
(1) ForgotPasswordScreen → POST /auth/forgot-password (email)
      │  navigate with params: { email }
      ▼
(2) ResetPasswordOtpScreen → POST /auth/verify-otp (email, otp)
      │  response contains resetToken
      │  navigate with params: { resetToken }
      ▼
(3) ResetPasswordScreen → POST /auth/reset-password (resetToken, newPassword, confirmPassword)
      │
      ▼
(4) ResetPasswordSuccessScreen → router.replace("/(auth)/login")
```
