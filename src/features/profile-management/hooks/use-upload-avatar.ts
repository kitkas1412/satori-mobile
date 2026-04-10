import { uploadAvatarApi } from "@/features/profile-management/api";
import { profileQueryKey } from "@/features/profile-management/hooks/use-profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: uploadAvatarApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey });
    },
  });

  async function handlePickFromLibrary() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Cần quyền truy cập",
        "Vui lòng cấp quyền truy cập thư viện ảnh trong Cài đặt.",
        [
          { text: "Hủy", style: "cancel" },
          { text: "Mở Cài đặt", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      mutate(result.assets[0]);
    }
  }

  async function handleTakePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Cần quyền truy cập",
        "Vui lòng cấp quyền truy cập camera trong Cài đặt.",
        [
          { text: "Hủy", style: "cancel" },
          { text: "Mở Cài đặt", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      mutate(result.assets[0]);
    }
  }

  function handleAvatarPress() {
    Alert.alert("Cập nhật ảnh đại diện", undefined, [
      { text: "Chụp ảnh", onPress: handleTakePhoto },
      { text: "Chọn từ thư viện", onPress: handlePickFromLibrary },
      { text: "Hủy", style: "cancel" },
    ]);
  }

  return { handleAvatarPress, isPending };
}
