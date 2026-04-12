import { IconButton, LoadingOverlay, PrimaryButton, RadioOptionRow, ScreenHeader } from "@/components/ui";
import { useProfile, useUpdateProfile } from "@/features/profile-management/hooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GENDER_OPTIONS = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
  { label: "Khác", value: "OTHER" },
] as const;

export function EditGenderScreen() {
  const router = useRouter();
  const { data: profile } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [selectedGender, setSelectedGender] = useState<string>(
    profile?.gender ?? ""
  );

  const handleConfirm = () => {
    if (!selectedGender) return;
    updateProfile({ gender: selectedGender }, { onSuccess: () => router.back() });
  };

  return (
    <>
      <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        <ScreenHeader
          title="Giới tính"
          paddingTop={insets.top + 16}
          leftAction={
            <IconButton
              icon={<ArrowLeft size={20} color={theme.icon.primary} />}
              onPress={() => router.back()}
            />
          }
        />

        <View style={{ flex: 1, paddingHorizontal: 16, gap: 12 }}>
          {GENDER_OPTIONS.map((option) => (
            <RadioOptionRow
              key={option.value}
              label={option.label}
              selected={selectedGender === option.value}
              onPress={() => setSelectedGender(option.value)}
            />
          ))}
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }}>
          <PrimaryButton
            text="Xác nhận"
            onPress={handleConfirm}
            disabled={!selectedGender || isPending}
            loading={isPending}
          />
        </View>
      </View>
      <LoadingOverlay visible={isPending} />
    </>
  );
}
