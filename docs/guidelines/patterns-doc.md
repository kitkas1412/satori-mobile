# Appendix: Code Patterns

> Part of the [System Design Ground Truth](system_design-doc.md).

Copy-paste templates for consistent implementation. Replace placeholder names.

---

## API Function

```ts
// src/features/<feature>/api/<resource>.ts
import { api } from "@/lib/axios";
import type { ResourceParams, ResourceResponse } from "./feature.types";

export async function resourceApi(
  params: ResourceParams,
): Promise<ResourceResponse> {
  const { data } = await api.post<ResourceResponse>(
    "/resource/endpoint",
    params,
  );
  return data;
}
```

---

## API Function — FormData Upload

Dùng khi endpoint yêu cầu `multipart/form-data`, ví dụ upload ảnh từ `expo-image-picker`.

React Native không có `Blob` chuẩn của trình duyệt — thay vào đó truyền object `{uri, name, type}` và cast `as unknown as Blob`. Axios tự xử lý đúng khi có header `Content-Type: multipart/form-data`.

```ts
// src/features/<feature>/api/upload-resource.ts
import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { UploadResponse } from "./feature.types";

export async function uploadResourceApi(
  resourceId: string,
  images: { uri: string; name: string }[],
): Promise<UploadResponse> {
  const form = new FormData();

  for (const img of images) {
    form.append("images", {
      uri: img.uri,
      name: img.name,
      type: "image/jpeg",
    } as unknown as Blob);
  }

  const response = await api.post<ApiResponse<UploadResponse>>(
    `/resource/${resourceId}/upload`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data.data;
}
```

Khi endpoint nhận thêm JSON metadata cùng với file, đóng gói JSON thành một phần riêng với `type: "application/json"`:

```ts
const dataPart = JSON.stringify({ resourceId, prompt });
form.append("data", {
  string: dataPart,
  type: "application/json",
  name: "data",
} as unknown as Blob);
```

Trong hook, map `ImagePickerAsset[]` sang `{uri, name}` trước khi truyền vào API function:

```ts
images.map((img) => ({
  uri: img.uri,
  name: img.fileName ?? `image_${Date.now()}.jpg`, // fallback nếu không có tên file
}))
```

---

## Mutation Hook (without store update)

```ts
// src/features/<feature>/hooks/use-action.ts
import { actionApi } from "@/features/<feature>/api";
import { useMutation } from "@tanstack/react-query";

export function useAction() {
  return useMutation({
    mutationFn: actionApi,
    onSuccess: (response) => {
      // Handle success (e.g., show toast, navigate via screen callback)
    },
  });
}
```

---

## Mutation Hook (with store update)

```ts
// src/features/authentication/hooks/use-login.ts
import { loginApi } from "@/features/authentication/api";
import { useAuthStore } from "@/stores";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      login(
        response.data.user,
        response.data.accessToken,
        response.data.refreshToken,
      );
    },
  });
}
```

---

## Query Hook with queryKeys

```ts
// src/features/<feature>/hooks/use-resource.ts
import { fetchResourceApi } from "@/features/<feature>/api";
import { useQuery } from "@tanstack/react-query";

export const resourceKeys = {
  all: ["feature", "resource"] as const,
  byId: (id: string) => [...resourceKeys.all, id] as const,
};

export function useResource(id: string) {
  return useQuery({
    queryKey: resourceKeys.byId(id),
    queryFn: () => fetchResourceApi(id),
    enabled: !!id,
  });
}
```

---

## Infinite Query Hook (phân trang)

Dùng `useInfiniteQuery` cho danh sách có phân trang. Query key dùng `.filtered(...)` thay vì `.byId()`, và export thêm `.all` để các mutation hook có thể invalidate toàn bộ nhóm.

```ts
// src/features/<feature>/hooks/use-resource-list.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchResourceListApi } from "../api";
import type { StatusFilter } from "../api/feature.types";

export const resourceKeys = {
  all: ["feature", "resource"] as const,
  filtered: (status?: StatusFilter, groupId?: string) =>
    [...resourceKeys.all, status ?? "all", groupId ?? "all"] as const,
};

export function useResourceList(status?: StatusFilter, groupId?: string) {
  return useInfiniteQuery({
    queryKey: resourceKeys.filtered(status, groupId),
    queryFn: ({ pageParam }) => fetchResourceListApi(pageParam, status, groupId),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.pageNumber + 1,
  });
}
```

Trong component, flatten `pages` để lấy danh sách phẳng:

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useResourceList(status);
const items = data?.pages.flatMap((p) => p.content) ?? [];
```

**Rules:**
- `initialPageParam: 0` — page đầu tiên luôn là 0.
- `getNextPageParam` trả `undefined` khi `lastPage.last === true` để báo hết trang.
- `.all` là base key để invalidate toàn bộ danh sách bất kể filter: `queryClient.invalidateQueries({ queryKey: resourceKeys.all })`.

---

## Form Hook

```ts
// src/features/<feature>/hooks/use-action-form.ts
import { useState } from "react";
import { useAction } from "./use-action";

export function useActionForm() {
  const [field, setField] = useState("");
  const [fieldError, setFieldError] = useState("");
  const actionMutation = useAction();

  const handleFieldChange = (text: string) => {
    setField(text);
    if (fieldError) setFieldError("");
  };

  const handleSubmit = async () => {
    try {
      await actionMutation.mutateAsync({ field: field.trim() });
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Action failed. Please try again.";
      setFieldError(message);
    }
  };

  const isFormValid = field.trim().length > 0;

  return {
    field,
    fieldError,
    isLoading: actionMutation.isPending,
    isFormValid,
    handleFieldChange,
    handleSubmit,
  };
}
```

---

## Screen Component

```tsx
// src/features/<feature>/screens/action-screen.tsx
import { PrimaryButton } from "@/components/ui/button";
import { BaseInput } from "@/components/ui/base-input";
import { SafeAreaView, View, Text } from "react-native";
import { useActionForm } from "../hooks/use-action-form";

export function ActionScreen() {
  const {
    field,
    fieldError,
    isLoading,
    isFormValid,
    handleFieldChange,
    handleSubmit,
  } = useActionForm();

  return (
    <SafeAreaView className="flex-1 bg-background-default">
      <View className="flex-1 px-6 pt-4">
        <Text className="font-heading text-2xl text-typography-black">
          Screen Title
        </Text>
        <BaseInput
          value={field}
          onChangeText={handleFieldChange}
          placeholder="Enter value"
          error={fieldError}
          label="Field Label"
        />
        <PrimaryButton
          text="Submit"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!isFormValid}
        />
      </View>
    </SafeAreaView>
  );
}
```

---

## Navigation Callback Hook

When a hook needs to trigger navigation as part of its logic (e.g., after loading data, checking status, or handling errors), pass an `onNavigate` callback from the screen instead of calling `useRouter()` inside the hook. This keeps hooks free of navigation side-effects and makes them easier to test.

```ts
// src/features/<feature>/hooks/use-action-navigation.ts
import { useState } from "react";
import { fetchSomeApi } from "../api";

export function useActionNavigation(
  onNavigate: (pathname: string, params?: Record<string, string>) => void,
) {
  const [isLoading, setIsLoading] = useState(false);

  async function handlePress(item: SomeItem) {
    try {
      setIsLoading(true);
      const data = await fetchSomeApi(item.id);
      // Store data if needed, then navigate
      onNavigate("/some-result", { id: item.id });
    } catch (error) {
      useErrorOverlayStore.getState().show(extractApiError(error));
    } finally {
      setIsLoading(false);
    }
  }

  return { handlePress, isLoading };
}
```

```tsx
// src/features/<feature>/screens/list-screen.tsx
import { useRouter } from "expo-router";
import { useActionNavigation } from "../hooks";

export function ListScreen() {
  const router = useRouter();
  const { handlePress, isLoading } = useActionNavigation(
    (pathname, params) => router.push({ pathname: pathname as any, params }),
  );

  // ...
}
```

**Rules:**
- The hook receives `onNavigate` — it never imports `useRouter` directly.
- The screen owns the router and passes a lambda that calls `router.push` / `router.replace`.
- This pattern is required whenever a hook must navigate conditionally (e.g., different routes based on item status).

---

## Submission Hook

Hook nộp bài / submit form cần thực hiện đúng thứ tự 3 bước trong `onSuccess`:  
**1. Lưu kết quả vào store** → **2. Invalidate cache** → **3. Gọi `onNavigate`**

Lưu store trước navigate để màn hình kết quả đọc được ngay khi mount. Invalidate cache để danh sách phản ánh trạng thái mới sau khi user quay lại.

```ts
// src/features/<feature>/hooks/use-submit-resource.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitResourceApi } from "../api";
import { useResourceStore } from "@/stores";
import { selectSetResult } from "@/stores/resource-store";
import { resourceKeys } from "./use-resource-list";

interface UseSubmitResourceParams {
  resourceId: string;
  payload: SubmitPayload;
  onNavigate: () => void;
}

export function useSubmitResource({
  resourceId,
  payload,
  onNavigate,
}: UseSubmitResourceParams) {
  const queryClient = useQueryClient();
  const setResult = useResourceStore(selectSetResult);

  const mutation = useMutation({
    mutationFn: () => submitResourceApi(resourceId, payload),
    onSuccess: (result) => {
      setResult(result);                                                  // 1. lưu vào store
      queryClient.invalidateQueries({ queryKey: resourceKeys.all });     // 2. làm mới cache
      onNavigate();                                                       // 3. điều hướng
    },
  });

  return { handleSubmit: mutation.mutate, isPending: mutation.isPending, isError: mutation.isError };
}
```

**Rules:**
- Hook nhận `onNavigate: () => void` — không import `useRouter` trực tiếp (xem Navigation Callback Hook).
- Thứ tự trong `onSuccess` là bắt buộc: store → invalidate → navigate.
- Gọi `clear*` action của store ngay khi màn hình kết quả unmount để tránh stale data.

---

## Tab Screen with LoadingOverlay

Tab screens (`src/app/(tabs)/`) remain mounted in the background when the user navigates to a Stack screen. React Native's `Modal` (used by `LoadingOverlay`) renders over all content regardless of which tab is active — on Android this causes overlays from background tabs to appear over the current screen.

**Rule:** Always gate `LoadingOverlay` visibility with `useIsFocused()` in tab screens.

```tsx
import { useIsFocused } from "@react-navigation/native";
// or: import { useIsFocused } from "expo-router";

export default function SomeTabScreen() {
  const isFocused = useIsFocused();
  const { isLoading } = useSomeQuery();

  return (
    <View>
      {/* ... */}
      <LoadingOverlay visible={isFocused && isLoading} title="Đang tải..." />
    </View>
  );
}
```

This applies to **all** `LoadingOverlay` instances in tab screens, including those inside child components rendered within a tab route.

---

## Route File (thin shell)

```tsx
// src/app/(auth)/action.tsx  — default export required for Expo Router
import { ActionScreen } from "@/features/<feature>/screens";

export default function ActionRoute() {
  return <ActionScreen />;
}
```

---

## Zustand Store

Split `State` and `Actions` into separate interfaces, then merge both in `create`. Use the **curried `()()`** form — required for correct TypeScript inference in Zustand v5.

```ts
// src/stores/<name>-store.ts
import { create } from "zustand";

interface NameState {
  value: string;
}

interface NameActions {
  setValue: (value: string) => void;
  clear: () => void;
}

export const useNameStore = create<NameState & NameActions>()((set) => ({
  // State
  value: "",

  // Actions
  setValue: (value) => set({ value }),
  clear: () => set({ value: "" }),
}));

// Selectors
export const selectValue = (state: NameState & NameActions) => state.value;
```

> **Note:** The curried form `create<T>()((set) => ...)` is mandatory when using TypeScript. The non-curried form `create<T>((set) => ...)` loses type inference for actions.

---

## Discriminated Union Types

Dùng khi API trả về response có nhiều shape khác nhau tùy theo một field phân biệt (discriminant). TypeScript sẽ tự thu hẹp type sau `if` / `switch` mà không cần cast.

```ts
// src/features/<feature>/api/feature.types.ts

interface ResourceBase {
  id: string;
  title: string;
  type: "TYPE_A" | "TYPE_B";
}

export interface TypeAResource extends ResourceBase {
  type: "TYPE_A";
  aContent: AContent;       // chỉ có ở TYPE_A
  bContent: null;
}

export interface TypeBResource extends ResourceBase {
  type: "TYPE_B";
  aContent: null;
  bContent: BContent;       // chỉ có ở TYPE_B
}

export type ResourceResponse = TypeAResource | TypeBResource;
```

Narrowing trong component hoặc hook:

```ts
function handleResource(resource: ResourceResponse) {
  if (resource.type === "TYPE_A") {
    // TypeScript biết resource là TypeAResource — aContent không null
    console.log(resource.aContent);
  } else {
    // TypeScript biết resource là TypeBResource — bContent không null
    console.log(resource.bContent);
  }
}
```

**Rules:**
- Field phân biệt (discriminant) phải là **literal type** (`"TYPE_A"` không phải `string`).
- Variant nào không có field của variant kia thì khai báo tường minh là `null`, không dùng `?` optional — tránh TypeScript cho phép cả hai variant có field đó.
- Dùng discriminated union thay vì `type: string` + optional fields khi response thực sự có cấu trúc khác nhau theo loại.
