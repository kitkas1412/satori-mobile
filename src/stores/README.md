# Zustand Stores

Thư mục này chứa các global state stores sử dụng Zustand.

## Stores có sẵn

### Auth Store (`auth-store.ts`)

Quản lý authentication state, bao gồm user info và token. Store này được persist vào AsyncStorage.

**Cách sử dụng:**

```typescript
import { useAuthStore } from '@/stores';

function Profile() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <View>
      <Text>{user?.name}</Text>
      <Button onPress={logout}>Đăng xuất</Button>
    </View>
  );
}
```

**Với selectors (tối ưu performance):**

```typescript
import { useAuthStore, selectUser } from "@/stores";

function Profile() {
  const user = useAuthStore(selectUser);
  // Component chỉ re-render khi user thay đổi
}
```

### App Store (`app-store.ts`)

Quản lý app-wide settings như theme, language, online status.

**Cách sử dụng:**

```typescript
import { useAppStore } from '@/stores';

function Settings() {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  return (
    <Button onPress={() => setTheme('dark')}>
      Dark Mode
    </Button>
  );
}
```

## Tạo Store mới

```typescript
import { create } from "zustand";

interface MyState {
  count: number;
  increment: () => void;
}

export const useMyStore = create<MyState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

## Persist Store

Để lưu state vào AsyncStorage:

```typescript
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      // your state
    }),
    {
      name: "my-storage-key",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

## Best Practices

1. **Sử dụng selectors** để tối ưu re-renders
2. **Tách actions và state** rõ ràng trong interface
3. **Persist chỉ những gì cần thiết** với `partialize`
4. **Export selectors** cho các use cases phổ biến
5. **Đặt tên store** theo domain/feature (auth, user, cart, etc.)
