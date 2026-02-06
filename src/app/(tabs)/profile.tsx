import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyRound, LogOut } from "lucide-react-native";
import { Alert, Pressable, Text, View } from "react-native";

export default function ProfileScreen() {
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn muốn đăng xuất?",
      [
        {
          text: "Huỷ",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          style: "destructive",
          onPress: () => {
            logout();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View className="flex-1 bg-background-default">
      <StatusBar style="dark" />

      <View className="px-6 pt-16 pb-6">
        <Text className="text-text-default text-2xl font-bold">Cá nhân</Text>
      </View>

      {user && (
        <View className="px-6 py-4 bg-white mx-4 rounded-2xl mb-4">
          <Text className="text-text-default text-lg font-semibold mb-1">
            {user.name || user.email}
          </Text>
          <Text className="text-text-muted text-sm">{user.email}</Text>
        </View>
      )}

      <View className="px-6 mt-4 gap-3">
        <Pressable
          onPress={() => router.push("/change-password")}
          className="flex-row items-center justify-center bg-primary-default py-4 px-6 rounded-xl active:opacity-80"
        >
          <KeyRound size={20} color="white" />
          <Text className="text-white text-base font-semibold ml-2">
            Thay đổi mật khẩu
          </Text>
        </Pressable>

        <Pressable
          onPress={handleLogout}
          className="flex-row items-center justify-center bg-red-500 py-4 px-6 rounded-xl active:opacity-80"
        >
          <LogOut size={20} color="white" />
          <Text className="text-white text-base font-semibold ml-2">
            Đăng xuất
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
