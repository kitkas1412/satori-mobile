# Architecture Pattern, Directory Structure & Data Flow

> Part of the [System Design Ground Truth](system_design-doc.md).

---

## Architecture Pattern

**Feature-Based Vertical Slice + Clean Architecture layers within each feature.**

Each feature owns its full stack: API functions → hooks → screens. Shared infrastructure (axios, stores, UI primitives) lives in `src/lib`, `src/stores`, and `src/components`.

**Layer rules within a feature (strict top-to-bottom dependency):**

```
screens → hooks → api functions → src/lib/axios
                ↘ stores (read/write client state)
```

- `screens` call hooks, never call API functions directly.
- `hooks` call API functions and stores; they never navigate.
- `api functions` call `api` (the axios helper); they never touch stores or hooks.

---

## Directory Structure

```
src/
├── app/                          # Expo Router route files (thin shells — except (tabs)/, see below)
│   ├── _layout.tsx               # Root layout: provider tree + auth guard
│   ├── (auth)/                   # Auth route group (unauthenticated) — thin shells only
│   ├── (tabs)/                   # Main app tab group — may contain screen logic directly when tab aggregates multiple features
│   ├── change-password.tsx              # Root-level stack screens
│   ├── change-password-success.tsx
│   ├── conversation-detail.tsx          # Accepts ?conversationId param
│   ├── conversation-practice.tsx
│   ├── conversation-feedback.tsx
│   ├── theme-selector.tsx
│   ├── topic-detail.tsx
│   ├── assignment-quiz.tsx
│   ├── assignment-writing.tsx
│   ├── assignment-writing-result.tsx
│   ├── assignment-reward.tsx
│   ├── quiz-result.tsx
│   ├── achievements.tsx
│   └── badge-detail.tsx              # Accepts ?badgeId param
│
├── features/                     # Feature slices (vertical)
│
├── components/                   # Shared cross-feature UI
│   ├── ui/                       # Primitive UI components
│   │   ├── base-input.tsx        # BaseInput (the only text input component)
│   │   ├── button.tsx            # PrimaryButton
│   │   ├── icon-button.tsx       # IconButton (generic icon tap target)
│   │   ├── loading-overlay.tsx
│   │   ├── loading-spinner.tsx
│   │   ├── screen-header.tsx     # Header with title, left/right actions
│   │   ├── screen-async-view.tsx # Wrapper for loading/error/empty states
│   │   ├── progress-bar.tsx
│   │   ├── score-ring.tsx        # Circular SVG score ring
│   │   ├── score-circle.tsx
│   │   ├── section-header.tsx
│   │   ├── markdown-text.tsx     # Markdown + furigana + underline renderer
│   │   ├── text-link.tsx
│   │   ├── icon-symbol.tsx
│   │   └── index.ts
│   └── providers/
│       └── query-provider.tsx    # Wraps children with QueryClientProvider
│
├── stores/                       # Zustand stores
│   ├── auth-store.ts             # Auth state + SecureStore persistence
│   ├── app-store.ts              # App-wide state (theme, language, online)
│   ├── assignment-store.ts       # Temporary assignment result (quiz + writing) for route handoff
│   ├── error-overlay-store.ts    # Global error overlay (message + optional back callback)
│   ├── conversation-store.ts     # Active speaking session state (messages, missions, feedback)
│   └── index.ts                  # Re-exports all stores
│
├── lib/                          # Infrastructure singletons
│   ├── axios.ts                  # Axios instance + api helper + interceptors
│   └── query-client.ts           # TanStack QueryClient singleton
│
├── hooks/                        # Shared hooks (not feature-specific)
│   ├── use-color-scheme.ts
│   ├── use-theme-color.ts
│   └── api/                      # Generic shared API hooks (e.g. use-users.ts)
│
├── constants/
│   └── theme.ts                  # Colors and Fonts objects
│
└── types/
    └── api.ts                    # Shared API response types (ApiResponse<T>, ApiError, …)
```

---

## Feature Structure

Every feature module under `src/features/<feature-name>/` MUST follow this structure:

```
src/features/<feature-name>/
├── api/
│   ├── <feature>.types.ts    # All request/response interfaces
│   ├── <endpoint>.ts          # One file per API endpoint
│   └── index.ts               # Barrel: export types + API functions
├── components/
│   ├── <component>.tsx        # Feature-specific UI components
│   └── index.ts               # Barrel: export all components
├── hooks/
│   ├── use-<action>.ts        # React Query hooks + custom hooks
│   └── index.ts               # Barrel: export all hooks
├── screens/
│   ├── <name>-screen.tsx      # Full screen components
│   └── index.ts               # Barrel: export all screens
└── utils/
    ├── <utility>.ts           # Feature-specific helpers
    └── index.ts               # Barrel: export all utilities
```

---

## Full Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         SCREEN                                  │
│   Renders UI, binds to form hook outputs, shows loading/error   │
└─────────────────────┬───────────────────────────────────────────┘
                      │ calls
┌─────────────────────▼───────────────────────────────────────────┐
│                      FORM HOOK (use-*-form)                     │
│   Manages local form state, validation, refs                    │
│   Calls mutation hook on submit                                 │
└─────────────────────┬───────────────────────────────────────────┘
                      │ calls .mutate() / .mutateAsync()
┌─────────────────────▼───────────────────────────────────────────┐
│                   MUTATION HOOK (use-*)                         │
│   useMutation({ mutationFn: apiFunction })                      │
│   onSuccess: updates Zustand store if needed                    │
└──────────┬──────────────────────────────────┬───────────────────┘
           │ calls                            │ calls (on success)
┌──────────▼────────────────┐    ┌─────────────▼──────────────────┐
│    API FUNCTION           │    │      ZUSTAND STORE             │
│  async fn(params)         │    │  authStore.login(user, tokens) │
│  api.post("/auth/login")  │    │  Persists to SecureStore       │
└──────────┬────────────────┘    └─────────────┬──────────────────┘
           │                                   │ isAuthenticated changes
┌──────────▼────────────────┐    ┌─────────────▼──────────────────┐
│    AXIOS INSTANCE         │    │        AUTH GUARD              │
│  + request interceptor    │    │  _layout.tsx useEffect         │
│  + response interceptor   │    │  router.replace("/(tabs)")     │
└──────────┬────────────────┘    └────────────────────────────────┘
           │
┌──────────▼────────────────┐
│       BACKEND API         │
│  REST JSON over HTTPS     │
└───────────────────────────┘
```
