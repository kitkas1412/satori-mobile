# File Naming Conventions and Anti-Patterns

> Part of the [System Design Ground Truth](system_design-doc.md).

---

## File Naming and Conventions

| Rule                                 | Example                                         |
| ------------------------------------ | ----------------------------------------------- |
| File names: kebab-case               | `use-login-form.ts`, `login-screen.tsx`         |
| Hook files: `use-` prefix            | `use-login.ts`, `use-logout.ts`                 |
| Store files: `-store` suffix         | `auth-store.ts`, `app-store.ts`                 |
| Type files: `.types.ts` suffix       | `auth.types.ts`                                 |
| Every subdirectory has `index.ts`    | `src/features/authentication/api/index.ts`      |
| Path alias `@/` maps to `src/`       | `import { api } from "@/lib/axios"`             |
| Named exports for screens/components | `export function LoginScreen() {}`              |
| Default exports ONLY for route files | `export default function LoginRoute() {}`       |
| Feature types co-located with API    | `src/features/authentication/api/auth.types.ts` |
| Shared types in `src/types/`         | `src/types/api.ts`                              |

### Import Order (enforced by ESLint)

1. React / React Native
2. Third-party libraries
3. `@/` path alias imports (project files)
4. Relative imports

---

## Anti-Patterns

The following are explicitly **forbidden**. Agents must never produce code that violates these rules.

| Anti-Pattern                                                          | Why Forbidden                                                                    | Correct Alternative                                                                                    |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Calling `useRouter()` or `router.push()` inside a hook                | Hooks must not cause navigation side-effects; navigation is the auth guard's job | Let `_layout.tsx` auth guard handle redirects; or return a flag from the hook for the screen to act on |
| `StyleSheet.create()`                                                 | Bypasses the semantic token system; harder to theme                              | Use `style={}` with `Colors[colorScheme]` semantic tokens                                              |
| Storing server/API response data in Zustand                           | Zustand is for client-only state; server data belongs in TanStack Query cache    | Use `useQuery` / `useMutation` from TanStack Query. **Exception:** `useAssignmentStore` deliberately stores API response data to pass large payloads between routes when Expo Router params cannot handle them — always `clear*` the store immediately after the result screen unmounts. |
| Creating a second Axios instance                                      | Breaks the shared interceptor (auth headers, 401 logout)                         | Always import `api` from `@/lib/axios`                                                                 |
| Importing between features (`features/A` importing from `features/B`) | Creates tight coupling between vertical slices                                   | Extract shared code to `src/components/`, `src/hooks/`, or `src/types/`                                |
| Calling an API function directly from a screen                        | Bypasses the hook layer; makes testing harder                                    | Create a mutation or query hook and call it from the screen                                            |
| Adding `useMemo`/`useCallback`/`React.memo` manually                  | React Compiler handles this; manual memoization is redundant and confusing       | Remove manual memoization; trust the compiler                                                          |
| Logic in route files (`src/app/`)                                     | Route files are thin shells; logic belongs in feature screens/hooks              | Move logic to `src/features/<feature>/screens/`. **Exception:** Tab route files in `src/app/(tabs)/` may contain screen logic directly when the tab aggregates multiple features with no single owner (e.g., `profile.tsx`). |
| Hardcoded hex values in `style={}`                                    | Breaks the design system, breaks dark mode                                       | Use semantic tokens from `Colors[colorScheme]` (e.g., `theme.text.primary`)                            |
| Using relative `../../` imports when `@/` works                       | Harder to refactor, breaks on directory moves                                    | Use `@/` path alias                                                                                    |
| Calling `queryClient.clear()` inside mutation `onSuccess`/`onError`   | Tab screens stay mounted in the background — clearing the cache triggers refetches on active observers, causing `LoadingOverlay` modals to appear over the current screen (especially on Android where `Modal` renders over all content regardless of navigation state) | Move `queryClient.clear()` to the auth guard in `_layout.tsx`, triggered when `isAuthenticated` becomes `false` |
| Rendering `LoadingOverlay` in tab screens without `useIsFocused()` guard | Tab screens remain mounted when not active — a `Modal`-based overlay from a background tab renders over the foreground screen on Android | Gate all `LoadingOverlay` in tab screens: `<LoadingOverlay visible={isFocused && isLoading} />` |
