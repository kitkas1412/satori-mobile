# State Management

> Part of the [System Design Ground Truth](system_design-doc.md).

---

## Zustand Auth Store (`src/stores/auth-store.ts`)

### Fields

| Field             | Type             | Persisted | Description                                  |
| ----------------- | ---------------- | --------- | -------------------------------------------- |
| `user`            | `User \| null`   | Yes       | Logged-in user object                        |
| `token`           | `string \| null` | Yes       | JWT access token                             |
| `refreshToken`    | `string \| null` | Yes       | JWT refresh token                            |
| `isAuthenticated` | `boolean`        | Yes       | Derived auth status                          |
| `isLoading`       | `boolean`        | No        | Ephemeral loading flag                       |
| `isHydrated`      | `boolean`        | No        | True after SecureStore rehydration completes |

**Persisted fields** are stored in `expo-secure-store` via `zustand/middleware` `persist` + `createJSONStorage`. Key: `"auth-storage"`.

### Actions

`login(user, token, refreshToken)`, `logout()`, `setUser()`, `setToken()`, `setRefreshToken()`, `updateUser(partial)`, `setHydrated()`.

### Selectors

```ts
export const selectUser = (state: AuthState) => state.user;
export const selectToken = (state: AuthState) => state.token;
export const selectIsAuthenticated = (state: AuthState) =>
  state.isAuthenticated;
```

### Usage in React components

```ts
const { isAuthenticated, isHydrated } = useAuthStore();
const login = useAuthStore((state) => state.login);
```

### Usage outside React (e.g., Axios interceptors)

```ts
// Use .getState() — do NOT call the hook outside components
const token = useAuthStore.getState().token;
const { logout } = useAuthStore.getState();
```

---

## Zustand App Store (`src/stores/app-store.ts`)

Holds app-wide ephemeral state. Not persisted.

| Field                  | Type                            | Default    |
| ---------------------- | ------------------------------- | ---------- |
| `isOnline`             | `boolean`                       | `true`     |
| `theme`                | `"light" \| "dark" \| "system"` | `"system"` |
| `language`             | `string`                        | `"vi"`     |
| `notificationsEnabled` | `boolean`                       | `true`     |

---

## Zustand Assignment Store (`src/stores/assignment-store.ts`)

Holds assignment result data **temporarily** between route transitions. Not persisted.

> **Why a store instead of route params?** Quiz and writing results can contain large payloads (e.g., `quizDetails` arrays, `imageUrls`). Expo Router search params cannot carry this data directly. The store is cleared as soon as the result screen unmounts.

| Field           | Type                            | Description                                                              |
| --------------- | ------------------------------- | ------------------------------------------------------------------------ |
| `quizResult`    | `SubmitQuizResponse \| null`    | Result of the most recent quiz submission                                |
| `assignmentId`  | `string \| null`                | ID of the assignment corresponding to the result                         |
| `writingResult` | `SubmitWritingResponse \| null` | Result of the most recent writing submission                             |
| `isReview`      | `boolean`                       | `true` when viewing a previously submitted result (not a fresh submission) |

### Actions

`setQuizResult(assignmentId, result, isReview?)`, `clearQuizResult()`, `setWritingResult(result, isReview?)`, `clearWritingResult()`.

> `isReview` defaults to `false`. Pass `true` when navigating to the result screen from the assignment list (not after a fresh submission). The result screen uses this flag to adjust UI labels (e.g., "Quay về" vs "Tiếp tục").

---

## Zustand Error Overlay Store (`src/stores/error-overlay-store.ts`)

Holds global error overlay state. Not persisted. Used to display a full-screen error modal from anywhere in the app — including non-React contexts (hooks, API callbacks).

| Field     | Type                    | Description                                         |
| --------- | ----------------------- | --------------------------------------------------- |
| `visible` | `boolean`               | Whether the error overlay is shown                  |
| `message` | `string`                | Error message to display                            |
| `onBack`  | `(() => void) \| undefined` | Optional callback when the user dismisses the overlay |

### Actions

`show(message, onBack?)`, `hide()`.

### Usage

```ts
// Inside a hook or async callback — use .getState() (not the hook)
useErrorOverlayStore.getState().show("Không tìm thấy thông tin bài nộp.");

// With a custom back handler
useErrorOverlayStore.getState().show("Lỗi không xác định.", () => router.back());
```

---

## Zustand Conversation Store (`src/stores/conversation-store.ts`)

Holds the active speaking session state. Not persisted. Cleared when the session ends (`clearSession()`).

| Field       | Type                              | Description                             |
| ----------- | --------------------------------- | --------------------------------------- |
| `sessionId` | `string \| null`                  | ID of the active conversation session   |
| `messages`  | `Messages[]`                      | Chat messages in the current session    |
| `missions`  | `Missions[]`                      | Missions assigned for the session       |
| `feedback`  | `FeedbackResultResponse \| null`  | Feedback result after session completes |

### Actions

`setSession(sessionId, messages, missions)`, `addMessages(messages)`, `removeMessage(id)`, `setMissions(missions)`, `setFeedback(feedback)`, `clearSession()`.

### Selectors

```ts
export const selectSessionId = (state) => state.sessionId;
export const selectMessages  = (state) => state.messages;
export const selectMissions  = (state) => state.missions;
export const selectFeedback  = (state) => state.feedback;
```

---

## TanStack Query Configuration (`src/lib/query-client.ts`)

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

**Query cache lifecycle on logout:** `queryClient.clear()` must NOT be called inside the logout mutation hook (`useLogout`). It must live in the auth guard (`_layout.tsx`) and fire when `isAuthenticated` becomes `false`:

```ts
useEffect(() => {
  if (!isAuthenticated && isHydrated) {
    queryClient.clear();
  }
}, [isAuthenticated, isHydrated, queryClient]);
```

At this point, tab screens are unmounting and have no active observers — so clearing the cache does not trigger unnecessary refetches. Calling `queryClient.clear()` while tabs are still mounted causes all active query observers to refetch, which on Android can surface `LoadingOverlay` modals over the current screen.

---

## Query Key Convention

Use nested arrays with the feature as the first element:

```ts
// Pattern
["featureName", "resourceType", identifier?, filters?]

// Examples
["auth", "profile"]
["speaking", "sessions"]
["speaking", "sessions", sessionId]
["practice", "lessons", { level: "beginner" }]
["achievement", "progress"]
["achievement", "badges"]
["assignments"]                              // base key — invalidates all assignment queries
["assignments", "GRADED", "class-abc"]      // filtered by status + classId
```

For features using infinite queries, export a `queryKeys` object that separates the base key (for bulk invalidation) from filtered variants:

```ts
export const assignmentQueryKeys = {
  all: ["assignments"] as const,
  filtered: (status?: LearnerSubmissionStatus, classId?: string) =>
    ["assignments", status ?? "all", classId ?? "all"] as const,
};

// Invalidate all assignment queries after submission
queryClient.invalidateQueries({ queryKey: assignmentQueryKeys.all });
```
