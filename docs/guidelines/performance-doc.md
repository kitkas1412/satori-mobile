# Performance Strategy

> Part of the [System Design Ground Truth](system_design-doc.md).

---

## React Compiler

`reactCompiler: true` is enabled in `app.json experiments`. This means the React Compiler handles memoization automatically.

**Do NOT add `useMemo`, `useCallback`, or `React.memo` manually.** The compiler handles it. Manual memoization is noise and can interfere.

---

## New Architecture

`newArchEnabled: true` is set in `app.json`. JSI and the Fabric renderer are active. Avoid bridged native modules unless absolutely necessary.

---

## Reanimated v4

Animations run on the UI thread. Use `useSharedValue`, `useAnimatedStyle`, and `withTiming`/`withSpring` from `react-native-reanimated`. Do not trigger re-renders from animation callbacks.

---

## @legendapp/motion

`@legendapp/motion` is a declarative animation library built on top of `react-native-reanimated`. Use it for component-level motion effects (entrance/exit animations, layout transitions) when the declarative API is cleaner than writing raw `useSharedValue`/`useAnimatedStyle`.

```tsx
import { Motion } from "@legendapp/motion";

<Motion.View
  animate={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, y: 20 }}
  transition={{ type: "spring" }}
/>
```

Animations still run on the UI thread via Reanimated under the hood. The same rule applies: do not trigger re-renders from animation callbacks.

---

## expo-image

Use `expo-image` (`<Image>` from `expo-image`) instead of React Native's built-in `Image`. It provides automatic caching, blurhash, and better memory management.

---

## List Performance

- Use `ScrollView` for lists with **fewer than 20 items**.
- Migrate to `FlatList` when a list grows past 20 items to avoid off-screen render overhead.
- Always set `keyExtractor` on `FlatList`.

---

## TanStack Query Cache

- Server data is cached for 5 minutes (`staleTime`) and garbage-collected after 10 minutes (`gcTime`).
- On logout: `queryClient.clear()` wipes all cached data immediately. This prevents stale data leaking between user sessions.
