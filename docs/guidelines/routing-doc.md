# Routing and Navigation

> Part of the [System Design Ground Truth](system_design-doc.md).

---

## Route Tree

```
/ (root Stack)
├── (auth)/                 — unauthenticated group
│   ├── welcome             → /(auth)/welcome
│   ├── login               → /(auth)/login
│   ├── forgot-password     → /(auth)/forgot-password
│   ├── reset-password-otp  → /(auth)/reset-password-otp
│   ├── reset-password      → /(auth)/reset-password
│   └── reset-password-success → /(auth)/reset-password-success
├── (tabs)/                 — authenticated tab group
│   ├── index               → / (Home)
│   ├── speaking            → /speaking
│   ├── practice            → /practice
│   └── profile             → /profile
├── change-password              → /change-password
├── change-password-success      → /change-password-success
├── conversation-detail          → /conversation-detail  (?conversationId)
├── conversation-practice        → /conversation-practice
├── conversation-feedback        → /conversation-feedback
├── theme-selector               → /theme-selector
├── topic-detail                 → /topic-detail
├── assignment-quiz              → /assignment-quiz
├── assignment-writing           → /assignment-writing
├── assignment-writing-result    → /assignment-writing-result
├── assignment-reward            → /assignment-reward
├── quiz-result                  → /quiz-result
└── achievements                 → /achievements
```

---

## Tab Bar Configuration

| Segment    | Title     | Icon                 |
| ---------- | --------- | -------------------- |
| `index`    | Trang chủ | `House` (lucide)     |
| `speaking` | Luyện nói | `Mic` (lucide)       |
| `practice` | Ôn tập    | `Dumbbell` (lucide)  |
| `profile`  | Cá nhân   | `UserRound` (lucide) |

Tab bar font: `Nunito_700Bold` size 12. Active color: `primary.default` (`#7b92ef`).

---

## Auth Guard Pattern

The auth guard lives in `src/app/_layout.tsx` inside the `RootLayoutNav` component. It uses `useSegments` and `useAuthStore`.

```tsx
// src/app/_layout.tsx (RootLayoutNav)
function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isHydrated) return; // Wait for SecureStore rehydration

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/welcome");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isHydrated, segments]);

  // Dọn React Query cache khi đăng xuất.
  // Đặt ở đây thay vì trong useLogout.onSuccess để đảm bảo cache chỉ bị clear
  // sau khi isAuthenticated = false — thời điểm tabs đang unmount và không còn
  // active observer nào, tránh kích hoạt refetch không cần thiết trên Android.
  useEffect(() => {
    if (!isAuthenticated && isHydrated) {
      queryClient.clear();
    }
  }, [isAuthenticated, isHydrated, queryClient]);

  return <Stack>...</Stack>;
}
```

**Critical:** The guard waits for `isHydrated` before redirecting. This prevents a flash-to-login on app start while SecureStore is loading.

**Query cache cleanup:** `queryClient.clear()` belongs in the auth guard (not inside the logout mutation hook). Calling it inside `onSuccess`/`onError` triggers refetches on background tab screens that are still mounted, causing `LoadingOverlay` modals to render over the current screen — particularly on Android where `Modal` renders over any content regardless of navigation state.

---

## Route File Shell Pattern

Route files are thin wrappers — they import and render the screen component from the feature slice. **No logic belongs in route files.**

```tsx
// src/app/(auth)/login.tsx
import { LoginScreen } from "@/features/authentication/screens";

export default function LoginRoute() {
  return <LoginScreen />;
}
```

**Exception — Tab route files (`src/app/(tabs)/`):** Tab files may contain screen logic directly when the tab view aggregates data from multiple features and there is no single owning feature. For example, the Profile tab (`profile.tsx`) combines `achievement`, `profile-management`, and `authentication` hooks into a single view — extracting this into one feature's screen would create an arbitrary ownership boundary. Tab files must still use `default export` and must not contain navigation logic (no `router.push()` for deep-links; use `onPress` handlers passed to child components).

---

## Passing Data Between Routes

Use Expo Router search params (`useLocalSearchParams`) for simple values (e.g., email passed to OTP screen). Never put server data in URL params or Zustand.

```tsx
// Navigating with params
router.push({ pathname: "/(auth)/reset-password-otp", params: { email } });

// Reading params in the destination screen
const { email } = useLocalSearchParams<{ email: string }>();
```
