import { useLogout } from "@/features/authentication/hooks";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyRound, LogOut } from "lucide-react-native";
import { Alert, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { LoadingOverlay, ScreenHeader } from "@/components/ui";

export default function ProfileScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { mutate: logoutUser, isPending } = useLogout();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();


  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: () => {
            logoutUser();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <>
      <View className="flex-1" style={{ backgroundColor: theme.background }}>
        <StatusBar style="dark" />

        <ScreenHeader
          title="Cá nhân"
          paddingTop={insets.top + 16}
        />

        {user && (
          <View
            className="px-6 py-4 mx-4 rounded-2xl mb-4"
            style={{ backgroundColor: theme.cardBackground }}
          >
            <Text
              className="text-lg font-semibold mb-1"
              style={{ color: theme.textDefault }}
            >
              {user.fullName || "Người dùng"}
            </Text>
            <Text className="text-sm" style={{ color: theme.textMuted }}>
              {user.email}
            </Text>
          </View>
        )}

        <View className="px-6 mt-4 gap-3">
          <Pressable
            onPress={() => router.push("/change-password")}
            className="flex-row items-center justify-center py-4 px-6 rounded-xl active:opacity-80"
            style={{ backgroundColor: theme.primary }}
          >
            <KeyRound size={20} color="white" />
            <Text
              className="text-base font-semibold ml-2"
              style={{ color: theme.textInverse }}
            >
              Thay đổi mật khẩu
            </Text>
          </Pressable>

          <Pressable
            onPress={handleLogout}
            disabled={isPending}
            className="flex-row items-center justify-center py-4 px-6 rounded-xl active:opacity-80"
            style={{ backgroundColor: theme.error }}
          >
            <LogOut size={20} color="white" />
            <Text
              className="text-white text-base font-semibold ml-2"
              style={{ color: theme.textInverse }}
            >
              Đăng xuất
            </Text>
          </Pressable>
        </View>
      </View>
      <LoadingOverlay visible={isPending} title="Đang đăng xuất..." />
    </>
  );
}
