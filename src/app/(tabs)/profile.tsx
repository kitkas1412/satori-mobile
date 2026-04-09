import { IconButton, LoadingOverlay, ScreenHeader } from "@/components/ui";
import { useLogout } from "@/features/authentication/hooks";
import { useProfile } from "@/hooks/api/use-profile";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pencil, Settings } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileTab() {
  const { data: profile, isLoading } = useProfile();
  const router = useRouter();
  const { mutate: logoutUser, isPending } = useLogout();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const enrolledClass = profile?.enrolledClasses?.[0];
  const jlptLevel = profile?.learningPreferences?.targetJlptLevel;

  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .slice(-2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <>
      <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        <ScreenHeader
          title="Cá nhân"
          paddingTop={insets.top + 16}
          rightAction={
            <IconButton
              icon={<Settings size={24} color={theme.icon.primary} />}
              onPress={() => router.push("/settings")}
            />
          }
        />

        {!isLoading && profile && (
          <View className="px-4">
            <View
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.background.surface,
                borderWidth: 1,
                borderColor: theme.border.subtle,
              }}
            >
              {/* Top section: avatar + name + badges + edit button */}
              <View
                className="px-4 pt-4 pb-3 flex-row items-start justify-between"
                style={{ borderBottomWidth: 1, borderBottomColor: theme.border.subtle }}
              >
                <View className="gap-2">
                  {/* Avatar */}
                  {profile.avatarUrl ? (
                    <Image
                      source={{ uri: profile.avatarUrl }}
                      className="rounded-full"
                      style={{ width: 70, height: 70 }}
                    />
                  ) : (
                    <View
                      className="rounded-full items-center justify-center"
                      style={{
                        width: 70,
                        height: 70,
                        backgroundColor: theme.brand.primarySubtle,
                      }}
                    >
                      <Text
                        className="font-heading text-xl"
                        style={{ color: theme.brand.primary }}
                      >
                        {initials}
                      </Text>
                    </View>
                  )}

                  {/* Name */}
                  <Text
                    className="font-heading text-lg"
                    style={{ color: theme.text.primary }}
                  >
                    {profile.fullName}
                  </Text>

                  {/* Badges */}
                  <View className="flex-row gap-1 flex-wrap">
                    {enrolledClass && (
                      <View
                        className="rounded-2xl px-2 py-1"
                        style={{ backgroundColor: theme.purple.default }}
                      >
                        <Text
                          className="font-body"
                          style={{ fontSize: 10, color: theme.text.onBrand }}
                        >
                          {`Lớp:  ${enrolledClass.className}`}
                        </Text>
                      </View>
                    )}
                    <View
                      className="rounded-2xl px-2 py-1"
                      style={{ backgroundColor: theme.brand.primary }}
                    >
                      <Text
                        className="font-body"
                        style={{ fontSize: 10, color: theme.text.onBrand }}
                      >
                        Level -
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Edit button */}
                <TouchableOpacity activeOpacity={0.6} hitSlop={12}>
                  <Pencil size={16} color={theme.icon.secondary} />
                </TouchableOpacity>
              </View>

              {/* Bottom section: JLPT goal */}
              <View className="px-4 py-3">
                <Text
                  className="font-body mb-1"
                  style={{ fontSize: 10, color: theme.text.secondary }}
                >
                  Mục tiêu JLPT
                </Text>
                <Text
                  className="font-body text-xs"
                  style={{ color: theme.text.primary }}
                >
                  {jlptLevel ?? "—"}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
      <LoadingOverlay visible={isPending} title="Đang đăng xuất..." />
    </>
  );
}
