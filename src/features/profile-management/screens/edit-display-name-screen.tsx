import { BaseInput, LoadingOverlay, PrimaryButton } from "@/components/ui";
import { useProfile, useUpdateProfile } from "@/features/profile-management/hooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function EditDisplayNameScreen() {
  const router = useRouter();
  const { data: profile } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [displayName, setDisplayName] = useState(
    profile?.displayName ?? profile?.fullName ?? ""
  );

  const handleConfirm = () => {
    if (!displayName.trim()) return;
    updateProfile({ displayName: displayName.trim() }, { onSuccess: () => router.back() });
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
        style={{ backgroundColor: theme.background.page }}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 16 }}
          keyboardShouldPersistTaps="always"
        >
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

          <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 16 }}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => router.back()}
              hitSlop={12}
              style={{ alignSelf: "flex-start" }}
            >
              <ArrowLeft size={24} color={theme.icon.primary} />
            </TouchableOpacity>

            <View style={{ marginTop: 24, gap: 4 }}>
              <Text
                className="font-heading"
                style={{ fontSize: 22, color: theme.text.primary }}
              >
                Nhập tên của bạn
              </Text>
              <Text
                className="font-body text-sm"
                style={{ color: theme.text.secondary }}
              >
                Tên này sẽ được hiển thị lên ứng dụng
              </Text>
            </View>

            <View style={{ marginTop: 16 }}>
              <BaseInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Nguyen Van A"
                autoCapitalize="words"
                autoFocus
                editable={!isPending}
                onSubmitEditing={handleConfirm}
                returnKeyType="done"
              />
            </View>
          </View>

          <View className="flex-1" />

          <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
            <PrimaryButton
              text="Xác nhận"
              onPress={handleConfirm}
              disabled={!displayName.trim() || isPending}
              loading={isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoadingOverlay visible={isPending} />
    </>
  );
}
