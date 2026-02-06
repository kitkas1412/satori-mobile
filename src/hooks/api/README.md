# TanStack Query - Custom Hooks

Thư mục này chứa các custom hooks sử dụng TanStack Query để fetch và mutate data.

**Note:** Authentication hooks đã được chuyển sang `@/features/authentication/hooks`

## Cấu trúc

```
hooks/api/
├── use-users.ts     # User CRUD hooks
└── index.ts         # Export tất cả hooks
```

## Hooks có sẵn

### Authentication Hooks (DEPRECATED)

**Đã chuyển sang:** `@/features/authentication/hooks`

#### `useLogin()`

Login user với email và password.

```typescript
import { useLogin } from '@/hooks/api';

function LoginScreen() {
  const loginMutation = useLogin();

  const handleLogin = async () => {
    try {
      await loginMutation.mutateAsync({
        email: 'user@example.com',
        password: 'password123',
      });
      // Login thành công - user và token đã được lưu vào store
      router.push('/home');
    } catch (error) {
      Alert.alert('Lỗi', 'Đăng nhập thất bại');
    }
  };

  return (
    <Button
      onPress={handleLogin}
      disabled={loginMutation.isPending}
    >
      {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
    </Button>
  );
}
```

#### `useRegister()`

Đăng ký user mới.

#### `useLogout()`

Logout user hiện tại.

### User Hooks

#### `useCurrentUser()`

Lấy thông tin user hiện tại.

```typescript
import { useCurrentUser } from '@/hooks/api';

function ProfileScreen() {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <View>
      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>
    </View>
  );
}
```

#### `useUser(userId: string)`

Lấy thông tin user theo ID.

```typescript
const { data: user, isLoading } = useUser("user-id-123");
```

#### `useUsers(filters?: string)`

Lấy danh sách users.

```typescript
const { data: users, isLoading } = useUsers();
```

#### `useUpdateUser()`

Cập nhật thông tin user.

```typescript
import { useUpdateUser } from '@/hooks/api';

function EditProfile() {
  const updateMutation = useUpdateUser();

  const handleUpdate = async () => {
    await updateMutation.mutateAsync({
      userId: 'user-123',
      data: { name: 'New Name' },
    });
  };

  return (
    <Button
      onPress={handleUpdate}
      disabled={updateMutation.isPending}
    >
      Cập nhật
    </Button>
  );
}
```

#### `useCreateUser()`

Tạo user mới.

#### `useDeleteUser()`

Xóa user.

## Query Keys

Tất cả query keys được định nghĩa tập trung để dễ quản lý:

```typescript
export const queryKeys = {
  users: {
    all: ["users"],
    lists: () => [...queryKeys.users.all, "list"],
    list: (filters: string) => [...queryKeys.users.lists(), { filters }],
    details: () => [...queryKeys.users.all, "detail"],
    detail: (id: string) => [...queryKeys.users.details(), id],
  },
  auth: {
    me: ["auth", "me"],
  },
};
```

## Tạo Hook mới

### Query Hook (GET)

```typescript
export function useMyData() {
  return useQuery({
    queryKey: ["myData"],
    queryFn: async () => {
      const response = await api.get("/my-endpoint");
      return response.data;
    },
  });
}
```

### Mutation Hook (POST/PUT/DELETE)

```typescript
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateItemParams) => {
      const response = await api.post("/items", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate để refetch
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
```

## Best Practices

1. **Tổ chức query keys** theo feature và hierarchy
2. **Invalidate queries** sau khi mutation thành công
3. **Sử dụng enabled** để control khi nào query chạy
4. **Handle loading và error states** trong component
5. **Optimistic updates** cho UX tốt hơn
6. **Type safety** với TypeScript generics
7. **Tách logic** ra khỏi components

## Advanced: Optimistic Updates

```typescript
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: UpdateUserParams) => {
      const response = await api.put(`/users/${userId}`, data);
      return response.data.data;
    },
    onMutate: async ({ userId, data }) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ["users", userId] });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(["users", userId]);

      // Optimistically update
      queryClient.setQueryData(["users", userId], (old: any) => ({
        ...old,
        ...data,
      }));

      return { previousUser };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          ["users", variables.userId],
          context.previousUser,
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
    },
  });
}
```
