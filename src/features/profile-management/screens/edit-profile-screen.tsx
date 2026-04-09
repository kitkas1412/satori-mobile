import { IconButton, ScreenHeader } from "@/components/ui";
import { ProfileRow } from "@/features/profile-management/components";
import { useProfile } from "@/hooks/api/use-profile";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GENDER_LABELS: Record<string, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
  PREFER_NOT_TO_SAY: "Không muốn nêu",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function EditProfileScreen() {
  const router = useRouter();
  const { data: profile } = useProfile();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <ScreenHeader
        title="Chỉnh sửa thông tin cá nhân"
        paddingTop={insets.top + 16}
        leftAction={
          <IconButton
            icon={<ArrowLeft size={20} color={theme.icon.primary} />}
            onPress={() => router.back()}
          />
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: insets.bottom + 24 }}
      >
        <ProfileRow
          label="Tên hiển thị"
          value={profile?.displayName ?? profile?.fullName ?? ""}
          onChangePress={() => router.push("/edit-display-name")}
        />
        <ProfileRow
          label="Email"
          value={profile?.email ?? ""}
        />
        <ProfileRow
          label="Số điện thoại"
          value={profile?.phoneNumber ?? ""}
        />
        <ProfileRow
          label="Ngày sinh"
          value={formatDate(profile?.dateOfBirth ?? null)}
        />
        <ProfileRow
          label="Giới tính"
          value={profile?.gender ? (GENDER_LABELS[profile.gender] ?? profile.gender) : ""}
          onChangePress={() => router.push("/edit-gender")}
        />
      </ScrollView>
    </View>
  );
}
